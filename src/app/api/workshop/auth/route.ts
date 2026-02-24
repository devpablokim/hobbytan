import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseApp } from "@/lib/firebase-admin";

// Types matching super-wks types
interface User {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: "admin" | "team_lead" | "student";
  cohortId: string;
  teamId: string | null;
  progress: {
    week0: { status: string; completedAt: string | null };
    week1: { status: string; completedAt: string | null };
    week2: { status: string; completedAt: string | null };
    week3: { status: string; completedAt: string | null };
    week4: { status: string; completedAt: string | null };
    week5: { status: string; completedAt: string | null };
  };
}

/**
 * Verify Firebase ID token and return user data
 * POST /api/workshop/auth
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const auth = getAuth(getFirebaseApp());
    let decodedToken;

    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { uid, email, name, picture } = decodedToken;

    // Get or create user in Firestore
    const db = getFirebaseAdmin();
    const userRef = db.collection("workshop_users").doc(uid);
    const userDoc = await userRef.get();

    let user: User;

    if (userDoc.exists) {
      // Existing user - return their data
      const userData = userDoc.data() as User;
      user = {
        ...userData,
        userId: uid,
        email: email || userData.email,
        displayName: name || userData.displayName,
        photoURL: picture || userData.photoURL,
      };

      // Update last login
      await userRef.update({
        lastLoginAt: new Date().toISOString(),
        email: email || userData.email,
        displayName: name || userData.displayName,
        photoURL: picture || userData.photoURL,
      });
    } else {
      // New user - create with default student role
      // Admin should manually upgrade role in Firestore
      const defaultProgress = {
        week0: { status: "not-started", completedAt: null },
        week1: { status: "not-started", completedAt: null },
        week2: { status: "not-started", completedAt: null },
        week3: { status: "not-started", completedAt: null },
        week4: { status: "not-started", completedAt: null },
        week5: { status: "not-started", completedAt: null },
      };

      user = {
        userId: uid,
        displayName: name || email?.split("@")[0] || "User",
        email: email || "",
        photoURL: picture || null,
        role: "student",
        cohortId: "", // Will be assigned by admin
        teamId: null,
        progress: defaultProgress,
      };

      await userRef.set({
        ...user,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

/**
 * Get current user session
 * GET /api/workshop/auth
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);

    // Verify the token
    const auth = getAuth(getFirebaseApp());
    let decodedToken;

    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user data from Firestore
    const db = getFirebaseAdmin();
    const userDoc = await db.collection("workshop_users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data() as User;

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        userId: decodedToken.uid,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}
