import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const COLLECTION = "dchoi09_qa_rules";

interface QARule {
  id?: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  priority: number;
  isActive: boolean;
  source: string;
  originalDate: string;
  created_at?: string;
  updated_at?: string;
}

// GET: Q&A 목록 조회
export async function GET(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");
    const activeOnly = searchParams.get("active") !== "false";

    let query = db.collection(COLLECTION)
      .orderBy("priority", "desc") as FirebaseFirestore.Query;

    if (activeOnly) {
      query = query.where("isActive", "==", true);
    }
    if (category && category !== "all") {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.offset(offset).limit(limit).get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side text search
    const filtered = search
      ? items.filter((item) => {
          const rule = item as unknown as QARule;
          const s = search.toLowerCase();
          return (
            rule.question.toLowerCase().includes(s) ||
            rule.answer.toLowerCase().includes(s) ||
            (rule.keywords || []).some((k) => k.toLowerCase().includes(s))
          );
        })
      : items;

    const countSnapshot = await db
      .collection(COLLECTION)
      .where("isActive", "==", true)
      .count()
      .get();
    const total = countSnapshot.data().count;

    return NextResponse.json({ items: filtered, total, limit, offset });
  } catch (error) {
    console.error("GET /api/dchoi09/qa error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Q&A" },
      { status: 500 }
    );
  }
}

// POST: 새 Q&A 추가 또는 벌크 임포트
export async function POST(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const body = await request.json();

    // Bulk import: { rules: QARule[] }
    if (body.rules && Array.isArray(body.rules)) {
      const batch = db.batch();
      let count = 0;
      const rules = body.rules as QARule[];

      for (const rule of rules) {
        const ref = db.collection(COLLECTION).doc();
        batch.set(ref, {
          question: rule.question || "",
          answer: rule.answer || "",
          category: rule.category || "general",
          keywords: rule.keywords || [],
          priority: rule.priority || 1,
          isActive: rule.isActive !== false,
          source: rule.source || "import",
          originalDate: rule.originalDate || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        count++;
        // Firestore batch limit = 500
        if (count % 500 === 0) {
          await batch.commit();
        }
      }
      if (count % 500 !== 0) {
        await batch.commit();
      }

      return NextResponse.json(
        { imported: count },
        { status: 201 }
      );
    }

    // Single add
    const { question, answer, category, keywords, priority } = body;
    if (!question || !answer) {
      return NextResponse.json(
        { error: "question and answer are required" },
        { status: 400 }
      );
    }

    const doc = {
      question,
      answer,
      category: category || "general",
      keywords: keywords || [],
      priority: priority || 1,
      isActive: true,
      source: "manual",
      originalDate: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const ref = await db.collection(COLLECTION).add(doc);
    return NextResponse.json({ id: ref.id, ...doc }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dchoi09/qa error:", error);
    return NextResponse.json(
      { error: "Failed to create Q&A" },
      { status: 500 }
    );
  }
}

// PUT: Q&A 수정
export async function PUT(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    const allowed = [
      "question",
      "answer",
      "category",
      "keywords",
      "priority",
      "isActive",
    ];
    for (const key of allowed) {
      if (fields[key] !== undefined) updateData[key] = fields[key];
    }

    await db.collection(COLLECTION).doc(id).update(updateData);
    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error("PUT /api/dchoi09/qa error:", error);
    return NextResponse.json(
      { error: "Failed to update Q&A" },
      { status: 500 }
    );
  }
}

// DELETE: Q&A 비활성화 (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.collection(COLLECTION).doc(id).update({
      isActive: false,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ id, isActive: false });
  } catch (error) {
    console.error("DELETE /api/dchoi09/qa error:", error);
    return NextResponse.json(
      { error: "Failed to delete Q&A" },
      { status: 500 }
    );
  }
}
