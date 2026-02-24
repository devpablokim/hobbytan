import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin, getFirebaseApp } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

// Helper to verify auth and get user role
async function verifyAuth(request: NextRequest): Promise<{
  uid: string;
  role: string;
  cohortId: string;
  teamId: string | null;
} | null> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.substring(7);

  try {
    const auth = getAuth(getFirebaseApp());
    const decodedToken = await auth.verifyIdToken(idToken);
    const db = getFirebaseAdmin();
    const userDoc = await db.collection("workshop_users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    return {
      uid: decodedToken.uid,
      role: userData?.role || "student",
      cohortId: userData?.cohortId || "",
      teamId: userData?.teamId || null,
    };
  } catch {
    return null;
  }
}

/**
 * GET /api/workshop/data
 * Query params:
 * - type: cohorts | curriculum | teams | users | submissions | posts | comments
 * - cohortId: filter by cohort
 * - teamId: filter by team
 * - userId: filter by user (for submissions)
 * - weekNumber: filter by week (for submissions)
 * - postId: required for comments
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const cohortId = searchParams.get("cohortId");
    const teamId = searchParams.get("teamId");
    const userId = searchParams.get("userId");
    const weekNumber = searchParams.get("weekNumber");
    const postId = searchParams.get("postId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    if (!type) {
      return NextResponse.json(
        { error: "Type parameter is required" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();
    let data: unknown[] = [];

    switch (type) {
      case "cohorts": {
        const snapshot = await db.collection("workshop_cohorts").get();
        data = snapshot.docs.map((doc) => ({ cohortId: doc.id, ...doc.data() }));
        break;
      }

      case "curriculum": {
        if (!cohortId) {
          return NextResponse.json(
            { error: "cohortId is required for curriculum" },
            { status: 400 }
          );
        }
        const snapshot = await db
          .collection("workshop_curriculum")
          .where("cohortId", "==", cohortId)
          .orderBy("order")
          .get();
        data = snapshot.docs.map((doc) => ({
          curriculumId: doc.id,
          ...doc.data(),
        }));
        break;
      }

      case "teams": {
        let query = db.collection("workshop_teams").limit(limit);
        if (cohortId) {
          query = query.where("cohortId", "==", cohortId);
        }
        const snapshot = await query.get();
        data = snapshot.docs.map((doc) => ({ teamId: doc.id, ...doc.data() }));
        break;
      }

      case "users": {
        // Students can only see users in their cohort
        // Team leads can see their team members
        // Admins can see all
        let query = db.collection("workshop_users").limit(limit);

        if (auth.role === "student") {
          query = query.where("cohortId", "==", auth.cohortId);
        } else if (auth.role === "team_lead" && auth.teamId) {
          query = query.where("teamId", "==", auth.teamId);
        } else if (cohortId && auth.role === "admin") {
          query = query.where("cohortId", "==", cohortId);
        }

        if (teamId && auth.role !== "student") {
          query = query.where("teamId", "==", teamId);
        }

        const snapshot = await query.get();
        data = snapshot.docs.map((doc) => {
          const userData = doc.data();
          // Remove sensitive fields for non-admin users
          if (auth.role !== "admin") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { createdAt, lastLoginAt, ...safeData } = userData;
            return { userId: doc.id, ...safeData };
          }
          return { userId: doc.id, ...userData };
        });
        break;
      }

      case "submissions": {
        let query = db.collection("workshop_submissions").limit(limit);

        // Apply filters based on role
        if (auth.role === "student") {
          // Students can only see their own submissions
          query = query.where("userId", "==", auth.uid);
        } else if (auth.role === "team_lead" && auth.teamId) {
          // Team leads see their team's submissions
          query = query.where("teamId", "==", auth.teamId);
        }

        // Additional filters
        if (userId && auth.role !== "student") {
          query = query.where("userId", "==", userId);
        }
        if (teamId && auth.role !== "student") {
          query = query.where("teamId", "==", teamId);
        }
        if (weekNumber) {
          query = query.where("weekNumber", "==", parseInt(weekNumber));
        }
        if (cohortId) {
          query = query.where("cohortId", "==", cohortId);
        }

        const snapshot = await query.orderBy("submittedAt", "desc").get();
        data = snapshot.docs.map((doc) => ({
          submissionId: doc.id,
          ...doc.data(),
        }));
        break;
      }

      case "posts": {
        let query = db.collection("workshop_posts").limit(limit);

        if (cohortId) {
          query = query.where("cohortId", "==", cohortId);
        }
        if (teamId) {
          // Include team-specific and cohort-wide posts
          query = query.where("teamId", "in", [teamId, null]);
        }

        const snapshot = await query.orderBy("createdAt", "desc").get();
        data = snapshot.docs.map((doc) => ({ postId: doc.id, ...doc.data() }));
        break;
      }

      case "comments": {
        if (!postId) {
          return NextResponse.json(
            { error: "postId is required for comments" },
            { status: 400 }
          );
        }
        const snapshot = await db
          .collection("workshop_posts")
          .doc(postId)
          .collection("comments")
          .orderBy("createdAt", "asc")
          .limit(limit)
          .get();
        data = snapshot.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        }));
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workshop/data
 * Create new records
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();
    let result: { id: string; data: unknown } | null = null;

    switch (type) {
      case "submission": {
        // Any authenticated user can create submissions
        const submission = {
          ...data,
          userId: auth.uid,
          teamId: auth.teamId,
          cohortId: auth.cohortId,
          submittedAt: new Date().toISOString(),
          feedback: null,
        };
        const docRef = await db.collection("workshop_submissions").add(submission);

        // Update user progress
        const weekKey = `progress.week${data.weekNumber}`;
        await db.collection("workshop_users").doc(auth.uid).update({
          [weekKey]: {
            status: "in-progress",
            completedAt: null,
          },
        });

        result = { id: docRef.id, data: submission };
        break;
      }

      case "post": {
        const post = {
          ...data,
          authorId: auth.uid,
          cohortId: auth.cohortId,
          teamId: auth.teamId,
          createdAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          pinned: false,
        };
        const docRef = await db.collection("workshop_posts").add(post);
        result = { id: docRef.id, data: post };
        break;
      }

      case "comment": {
        const { postId, content } = data;
        if (!postId || !content) {
          return NextResponse.json(
            { error: "postId and content are required" },
            { status: 400 }
          );
        }

        // Get user info for comment
        const userDoc = await db.collection("workshop_users").doc(auth.uid).get();
        const userData = userDoc.data();

        const comment = {
          authorId: auth.uid,
          authorName: userData?.displayName || "Anonymous",
          authorPhotoURL: userData?.photoURL || null,
          content,
          createdAt: new Date().toISOString(),
        };

        const commentRef = await db
          .collection("workshop_posts")
          .doc(postId)
          .collection("comments")
          .add(comment);

        // Increment comment count
        await db
          .collection("workshop_posts")
          .doc(postId)
          .update({
            commentsCount: (await db.collection("workshop_posts").doc(postId).get()).data()
              ?.commentsCount + 1 || 1,
          });

        result = { id: commentRef.id, data: comment };
        break;
      }

      case "curriculum": {
        // Only admins can create curriculum
        if (auth.role !== "admin") {
          return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
          );
        }
        const docRef = await db.collection("workshop_curriculum").add({
          ...data,
          createdAt: new Date().toISOString(),
        });
        result = { id: docRef.id, data };
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Data create error:", error);
    return NextResponse.json(
      { error: "Failed to create data" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workshop/data
 * Update existing records
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { error: "Type, id, and data are required" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();

    switch (type) {
      case "curriculum": {
        // Only admins can update curriculum
        if (auth.role !== "admin") {
          return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
          );
        }
        await db
          .collection("workshop_curriculum")
          .doc(id)
          .update({
            ...data,
            updatedAt: new Date().toISOString(),
          });
        break;
      }

      case "userProgress": {
        // Users can update their own progress
        // Team leads can update their team members' progress
        // Admins can update anyone
        const targetUserId = data.userId || auth.uid;

        if (auth.role === "student" && targetUserId !== auth.uid) {
          return NextResponse.json(
            { error: "Cannot update other users' progress" },
            { status: 403 }
          );
        }

        const weekKey = `progress.week${data.weekNumber}`;
        await db
          .collection("workshop_users")
          .doc(targetUserId)
          .update({
            [weekKey]: {
              status: data.status,
              completedAt:
                data.status === "completed" ? new Date().toISOString() : null,
            },
          });
        break;
      }

      case "feedback": {
        // Only team leads and admins can add feedback
        if (auth.role === "student") {
          return NextResponse.json(
            { error: "Students cannot add feedback" },
            { status: 403 }
          );
        }

        const userDoc = await db.collection("workshop_users").doc(auth.uid).get();
        const userData = userDoc.data();

        await db
          .collection("workshop_submissions")
          .doc(id)
          .update({
            feedback: {
              comment: data.comment,
              score: data.score || null,
              reviewedBy: userData?.displayName || "Anonymous",
              reviewedAt: new Date().toISOString(),
            },
          });
        break;
      }

      case "post": {
        // Check ownership or admin status
        const postDoc = await db.collection("workshop_posts").doc(id).get();
        if (!postDoc.exists) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        const postData = postDoc.data();
        if (postData?.authorId !== auth.uid && auth.role !== "admin") {
          return NextResponse.json(
            { error: "Cannot edit this post" },
            { status: 403 }
          );
        }

        await db
          .collection("workshop_posts")
          .doc(id)
          .update({
            ...data,
            updatedAt: new Date().toISOString(),
          });
        break;
      }

      case "likePost": {
        // Increment likes (simple implementation - production should track who liked)
        const postRef = db.collection("workshop_posts").doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        await postRef.update({
          likesCount: (postDoc.data()?.likesCount || 0) + 1,
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Data update error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workshop/data
 * Delete records
 */
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and id are required" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdmin();

    switch (type) {
      case "curriculum":
      case "cohort":
      case "team": {
        // Only admins can delete these
        if (auth.role !== "admin") {
          return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
          );
        }
        const collection = `workshop_${type === "curriculum" ? "curriculum" : type + "s"}`;
        await db.collection(collection).doc(id).delete();
        break;
      }

      case "post": {
        const postDoc = await db.collection("workshop_posts").doc(id).get();
        if (!postDoc.exists) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        const postData = postDoc.data();
        if (postData?.authorId !== auth.uid && auth.role !== "admin") {
          return NextResponse.json(
            { error: "Cannot delete this post" },
            { status: 403 }
          );
        }

        await db.collection("workshop_posts").doc(id).delete();
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Data delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
