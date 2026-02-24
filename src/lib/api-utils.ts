import { NextResponse } from "next/server";

/**
 * Standard API error codes and messages
 */
export const ApiErrors = {
  // 400 - Bad Request
  BAD_REQUEST: { code: "BAD_REQUEST", message: "Invalid request", status: 400 },
  MISSING_FIELDS: { code: "MISSING_FIELDS", message: "Required fields are missing", status: 400 },
  INVALID_FORMAT: { code: "INVALID_FORMAT", message: "Invalid data format", status: 400 },

  // 401 - Unauthorized
  UNAUTHORIZED: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 },
  INVALID_TOKEN: { code: "INVALID_TOKEN", message: "Invalid or expired token", status: 401 },

  // 403 - Forbidden
  FORBIDDEN: { code: "FORBIDDEN", message: "Access denied", status: 403 },
  INSUFFICIENT_PERMISSIONS: { code: "INSUFFICIENT_PERMISSIONS", message: "Insufficient permissions", status: 403 },

  // 404 - Not Found
  NOT_FOUND: { code: "NOT_FOUND", message: "Resource not found", status: 404 },

  // 429 - Too Many Requests
  RATE_LIMITED: { code: "RATE_LIMITED", message: "Too many requests", status: 429 },

  // 500 - Internal Server Error
  INTERNAL_ERROR: { code: "INTERNAL_ERROR", message: "Internal server error", status: 500 },
  DATABASE_ERROR: { code: "DATABASE_ERROR", message: "Database operation failed", status: 500 },
  EMAIL_ERROR: { code: "EMAIL_ERROR", message: "Email sending failed", status: 500 },
} as const;

export type ApiErrorCode = keyof typeof ApiErrors;

/**
 * Create standardized error response
 */
export function createErrorResponse(
  errorType: ApiErrorCode,
  details?: string,
  headers?: Record<string, string>
): NextResponse {
  const error = ApiErrors[errorType];

  const responseBody = {
    success: false,
    error: {
      code: error.code,
      message: details || error.message,
    },
  };

  return NextResponse.json(responseBody, {
    status: error.status,
    headers,
  });
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    ...data,
  });
}

/**
 * Wrap async handler with error catching
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Error:", error);

      // Check for specific error types
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("firebase") || message.includes("firestore")) {
          return createErrorResponse("DATABASE_ERROR", "Database operation failed");
        }

        if (message.includes("auth") || message.includes("token")) {
          return createErrorResponse("UNAUTHORIZED", "Authentication failed");
        }

        if (message.includes("permission") || message.includes("forbidden")) {
          return createErrorResponse("FORBIDDEN", "Access denied");
        }
      }

      return createErrorResponse("INTERNAL_ERROR");
    }
  };
}

/**
 * Validate required fields in request body
 */
export function validateRequired(
  body: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string, maxLength: number = 5000): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .trim()
    .slice(0, maxLength);
}

/**
 * Parse pagination parameters from URL
 */
export function parsePagination(searchParams: URLSearchParams): {
  limit: number;
  offset: number;
  cursor?: string;
} {
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "50"), 1),
    100
  );
  const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);
  const cursor = searchParams.get("cursor") || undefined;

  return { limit, offset, cursor };
}

/**
 * Log API request for monitoring
 */
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();

  console.log(
    JSON.stringify({
      type: "api_request",
      timestamp,
      method,
      path,
      userId: userId || "anonymous",
      ...metadata,
    })
  );
}

/**
 * Check if environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
