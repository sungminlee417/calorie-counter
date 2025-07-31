/**
 * Utility functions for consistent error handling across the application
 */

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

/**
 * Standardizes error messages for user-facing display
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Creates a standardized API error object
 */
export const createApiError = (
  message: string,
  options?: {
    code?: string;
    status?: number;
    details?: unknown;
  }
): ApiError => ({
  message,
  code: options?.code,
  status: options?.status,
  details: options?.details,
});

/**
 * Common error messages for consistent UX
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN:
    "Access denied. Please make sure you have the required permissions.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "A server error occurred. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

/**
 * Maps HTTP status codes to user-friendly error messages
 */
export const getErrorMessageFromStatus = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

/**
 * Logs errors consistently for debugging
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = getErrorMessage(error);
  const logContext = context ? `[${context}]` : "";

  console.error(`${logContext} Error:`, errorMessage);

  if (error instanceof Error && error.stack) {
    console.error("Stack trace:", error.stack);
  }

  if (typeof error === "object" && error !== null) {
    console.error("Error details:", error);
  }
};
