#!/bin/bash
# dchoi09 Q&A 데이터를 API를 통해 Firestore에 업로드
# 사용법: ./scripts/upload-qa-via-api.sh [BASE_URL]
# 예: ./scripts/upload-qa-via-api.sh https://hobbytan-ai.web.app

BASE_URL="${1:-http://localhost:3000}"
DATA_FILE="data/dchoi09-qa/qa_pairs.json"
BATCH_SIZE=10
DELAY=0.5

if [ ! -f "$DATA_FILE" ]; then
  echo "Error: $DATA_FILE not found"
  exit 1
fi

TOTAL=$(python3 -c "import json; print(len(json.load(open('$DATA_FILE'))))")
echo "Total Q&A pairs: $TOTAL"
echo "Uploading to: $BASE_URL/api/dchoi09/qa"
echo ""

python3 -c "
import json, urllib.request, time, sys

with open('$DATA_FILE') as f:
    data = json.load(f)

success = 0
fail = 0

for i, qa in enumerate(data):
    body = json.dumps({
        'question': qa['question'],
        'answer': qa['answer'],
        'category': qa.get('category', '기타'),
    }).encode('utf-8')
    
    req = urllib.request.Request(
        '$BASE_URL/api/dchoi09/qa',
        data=body,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        urllib.request.urlopen(req)
        success += 1
    except Exception as e:
        fail += 1
        if fail <= 3:
            print(f'  Error #{fail}: {e}', file=sys.stderr)
    
    if (i + 1) % 100 == 0:
        print(f'  Progress: {i+1}/{len(data)} (success={success}, fail={fail})')
        time.sleep($DELAY)

print(f'Done: {success} uploaded, {fail} failed out of {len(data)}')
"
