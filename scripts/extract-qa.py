#!/usr/bin/env python3
"""
dchoi09 카카오톡 대화 기록에서 Q&A 쌍을 추출하는 스크립트.
- 질문: 일반 유저 메시지 (? 포함 또는 질문 패턴)
- 답변: 관리자(09삼촌 데이빗, Monica 등) 응답
- 중복/충돌 질문 탐지
"""

import csv
import json
import re
import os
from collections import defaultdict
from difflib import SequenceMatcher

CHAT_DIR = "/Users/pablokim-mini/Downloads/chat_history"
OUTPUT_DIR = "/Users/pablokim-mini/.openclaw-dev_tan/workspace/repos/hobbytan/data/dchoi09-qa"

# Admin users (answer providers)
ADMIN_USERS = {"09삼촌 데이빗", "Monica", "모니카", "dchoi09", "디초이", "관리자"}

# System messages to skip
SKIP_PATTERNS = [
    "joined this chatroom",
    "left this chatroom",
    "Please beware of fake",
    "오픈채팅봇",
    "Announcement in Boards",
    "방장이",
    "활성화했습니다",
    "님이 들어왔습니다",
    "님이 나갔습니다",
]

def is_system_msg(text):
    return any(p in text for p in SKIP_PATTERNS)

def is_question(text):
    """Detect if a message is a question."""
    if len(text.strip()) < 5:
        return False
    # Korean question patterns
    q_patterns = [
        r'\?', r'인가요', r'일까요', r'할까요', r'인지요', r'나요\??',
        r'되나요', r'하나요', r'볼까요', r'있나요', r'없나요', r'맞나요',
        r'궁금', r'문의', r'질문', r'어떻게', r'언제', r'어디', r'얼마',
        r'몇', r'가능한가', r'되는건가', r'할수있', r'할 수 있',
        r'싶은데', r'알고싶', r'알고 싶', r'확인해', r'여쭤',
    ]
    for p in q_patterns:
        if re.search(p, text):
            return True
    return False

def is_admin(user):
    for admin in ADMIN_USERS:
        if admin.lower() in user.lower():
            return True
    return False

def parse_csv(filepath):
    """Parse KakaoTalk CSV export."""
    messages = []
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            header = next(reader, None)
            for row in reader:
                if len(row) >= 3:
                    date, user, msg = row[0], row[1], row[2]
                    if msg and not is_system_msg(msg):
                        messages.append({
                            'date': date,
                            'user': user.strip(),
                            'message': msg.strip(),
                            'is_admin': is_admin(user),
                        })
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
    return messages

def extract_qa_pairs(messages):
    """Extract Q&A pairs from sequential messages."""
    qa_pairs = []
    i = 0
    while i < len(messages):
        msg = messages[i]
        # Find questions from non-admin users
        if not msg['is_admin'] and is_question(msg['message']):
            question = msg['message']
            q_user = msg['user']
            q_date = msg['date']
            
            # Look for admin response within next 20 messages
            answers = []
            for j in range(i+1, min(i+21, len(messages))):
                next_msg = messages[j]
                if next_msg['is_admin']:
                    answers.append(next_msg['message'])
                    # Continue collecting consecutive admin messages
                    for k in range(j+1, min(j+5, len(messages))):
                        if messages[k]['is_admin'] and messages[k]['user'] == next_msg['user']:
                            answers.append(messages[k]['message'])
                        else:
                            break
                    break
                # If another question comes before an answer, stop
                elif is_question(next_msg['message']):
                    break
            
            if answers:
                qa_pairs.append({
                    'question': question,
                    'answer': '\n'.join(answers),
                    'asked_by': q_user,
                    'answered_by': messages[j]['user'] if answers else '',
                    'date': q_date,
                    'source_file': '',
                })
        i += 1
    return qa_pairs

def find_duplicates(qa_pairs, threshold=0.7):
    """Find questions that are similar but may have different answers."""
    duplicates = []
    seen = []
    
    for i, qa in enumerate(qa_pairs):
        q = qa['question'].lower().strip()
        for j, prev in enumerate(seen):
            ratio = SequenceMatcher(None, q, prev['q']).ratio()
            if ratio > threshold:
                duplicates.append({
                    'question_1': prev['original'],
                    'answer_1': qa_pairs[prev['idx']]['answer'][:200],
                    'question_2': qa['question'],
                    'answer_2': qa['answer'][:200],
                    'similarity': round(ratio, 2),
                    'same_answer': qa_pairs[prev['idx']]['answer'][:100] == qa['answer'][:100],
                })
                break
        seen.append({'q': q, 'idx': i, 'original': qa['question']})
    
    return duplicates

def categorize_qa(qa_pairs):
    """Categorize Q&A pairs by topic."""
    categories = {
        '배송': ['배송', '택배', '도착', '트래킹', 'tracking', '선적', '입항'],
        '결제': ['결제', '입금', 'zelle', 'venmo', 'paypal', '페이', '카드', '할부'],
        '주문': ['주문', '오더', '신청', '구매', '주문번호'],
        '전집': ['전집', '책', '도서', '도레미', '아람', '그레이트북스', '베이비올', '라라랜드'],
        '이유식': ['이유식', '산골', '알밤', '떡뻥', '쌀참', '과일참'],
        '가구': ['가구', '침대', '매트리스', '책장', '독서대'],
        '픽업': ['픽업', 'pick up', 'pickup', '수령'],
        '환불': ['환불', '취소', '캔슬', 'cancel', 'refund'],
        '프로모션': ['프로모션', '할인', '세일', '이벤트', '쿠폰'],
        '기타': [],
    }
    
    for qa in qa_pairs:
        q_lower = (qa['question'] + qa['answer']).lower()
        qa['category'] = '기타'
        for cat, keywords in categories.items():
            if any(kw in q_lower for kw in keywords):
                qa['category'] = cat
                break
    
    return qa_pairs

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    all_qa_pairs = []
    
    # Process all CSV files
    for filename in sorted(os.listdir(CHAT_DIR)):
        if not filename.endswith('.csv'):
            continue
        filepath = os.path.join(CHAT_DIR, filename)
        print(f"Processing: {filename}")
        
        messages = parse_csv(filepath)
        print(f"  → {len(messages)} messages (after filtering)")
        
        qa_pairs = extract_qa_pairs(messages)
        for qa in qa_pairs:
            qa['source_file'] = filename
        
        print(f"  → {len(qa_pairs)} Q&A pairs extracted")
        all_qa_pairs.extend(qa_pairs)
    
    print(f"\nTotal Q&A pairs: {len(all_qa_pairs)}")
    
    # Categorize
    all_qa_pairs = categorize_qa(all_qa_pairs)
    
    # Find duplicates (skip if too many pairs)
    if len(all_qa_pairs) < 2000:
        duplicates = find_duplicates(all_qa_pairs)
        print(f"Duplicate/similar questions found: {len(duplicates)}")
    else:
        duplicates = []
        print(f"Skipping duplicate detection ({len(all_qa_pairs)} pairs, too many for O(n²))")
    
    # Save Q&A pairs
    with open(os.path.join(OUTPUT_DIR, 'qa_pairs.json'), 'w', encoding='utf-8') as f:
        json.dump(all_qa_pairs, f, ensure_ascii=False, indent=2)
    
    # Save duplicates report
    with open(os.path.join(OUTPUT_DIR, 'duplicates.json'), 'w', encoding='utf-8') as f:
        json.dump(duplicates, f, ensure_ascii=False, indent=2)
    
    # Save category summary
    cat_summary = defaultdict(int)
    for qa in all_qa_pairs:
        cat_summary[qa['category']] += 1
    
    with open(os.path.join(OUTPUT_DIR, 'summary.json'), 'w', encoding='utf-8') as f:
        json.dump({
            'total_qa_pairs': len(all_qa_pairs),
            'total_duplicates': len(duplicates),
            'categories': dict(cat_summary),
            'source_files': list(set(qa['source_file'] for qa in all_qa_pairs)),
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\nCategory breakdown:")
    for cat, count in sorted(cat_summary.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")
    
    print(f"\nOutput saved to: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
