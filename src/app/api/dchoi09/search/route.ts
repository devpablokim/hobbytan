import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const COLLECTION = "dchoi09_qa_rules";

interface QADoc {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  priority: number;
}

// POST: 질문 검색 → 유사 Q&A 반환 (Small RAG)
export async function POST(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }

    const maxResults = Math.min(parseInt(body.limit) || 5, 10);
    const userKeywords = extractKeywords(query);

    if (userKeywords.length === 0) {
      return NextResponse.json({
        matched: false,
        escalate: true,
        message:
          "해당 질문에 대한 정보를 찾을 수 없습니다. Monica 담당자에게 연결합니다.",
        results: [],
      });
    }

    // Detect category for targeted search
    const category = detectCategory(query);

    // Fetch active Q&A rules (category-targeted + fallback)
    const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [];

    if (category !== "general") {
      queries.push(
        db
          .collection(COLLECTION)
          .where("isActive", "==", true)
          .where("category", "==", category)
          .limit(300)
          .get()
      );
    }
    // Always include general fallback
    queries.push(
      db
        .collection(COLLECTION)
        .where("isActive", "==", true)
        .limit(500)
        .get()
    );

    const snapshots = await Promise.all(queries);
    const seenIds = new Set<string>();
    const allDocs: QADoc[] = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        if (!seenIds.has(doc.id)) {
          seenIds.add(doc.id);
          allDocs.push({
            id: doc.id,
            ...(doc.data() as Omit<QADoc, "id">),
          });
        }
      }
    }

    // Score by keyword matching
    const scored = allDocs.map((doc) => {
      const qLower = doc.question.toLowerCase();
      const aLower = doc.answer.toLowerCase();
      const kws = (doc.keywords || []).map((k) => k.toLowerCase());
      let score = 0;

      for (const uk of userKeywords) {
        if (qLower.includes(uk)) score += 3;
        if (kws.some((k) => k.includes(uk))) score += 2;
        if (aLower.includes(uk)) score += 1;
      }

      // Priority boost
      score += (doc.priority || 1) * 0.1;

      return { ...doc, score };
    });

    const results = scored
      .filter((d) => d.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    if (results.length === 0) {
      return NextResponse.json({
        matched: false,
        escalate: true,
        message:
          "해당 질문에 대한 정보를 찾을 수 없습니다. Monica 담당자에게 연결합니다.",
        results: [],
        query,
        keywords: userKeywords,
        category,
      });
    }

    return NextResponse.json({
      matched: true,
      escalate: false,
      results: results.map((r) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category,
        score: r.score,
      })),
      query,
      keywords: userKeywords,
      category,
    });
  } catch (error) {
    console.error("POST /api/dchoi09/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    "은",
    "는",
    "이",
    "가",
    "을",
    "를",
    "에",
    "에서",
    "의",
    "로",
    "으로",
    "도",
    "만",
    "까지",
    "부터",
    "와",
    "과",
    "하고",
    "이고",
    "인데",
    "그",
    "저",
    "것",
    "수",
    "등",
    "더",
    "좀",
    "잘",
    "네요",
    "인가요",
    "할까요",
    "나요",
    "되나요",
    "하나요",
    "있나요",
    "없나요",
    "안녕하세요",
    "감사합니다",
    "궁금합니다",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[?!.,;:~]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !stopwords.has(w));

  return Array.from(new Set(words));
}

function detectCategory(text: string): string {
  const categories: Record<string, string[]> = {
    shipping: ["배송", "택배", "도착", "트래킹", "tracking", "선적", "입항"],
    payment: ["결제", "입금", "zelle", "venmo", "paypal", "페이", "카드"],
    stock_availability: ["재고", "품절", "주문", "오더", "신청", "구매"],
    product_spec: ["스펙", "사이즈", "크기", "무게", "색상", "재질"],
    promotion: ["프로모션", "할인", "세일", "이벤트", "쿠폰"],
    installation: ["설치", "조립", "세팅"],
    warranty_service: ["보증", "as", "수리", "교환"],
    refund_exchange: ["환불", "취소", "캔슬", "cancel", "refund", "반품"],
  };

  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return "general";
}
