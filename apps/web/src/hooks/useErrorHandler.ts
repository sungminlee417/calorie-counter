import { useCallback } from "react";
import { getErrorMessage, logError } from "@/utils/error-handling";
import useToast from "@/hooks/useToast";

/**
 * Custom hook for consistent error handling with toast notifications
 */
const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown, context?: string, customMessage?: string) => {
      // Log the error for debugging
      logError(error, context);

      // Show user-friendly error message
      const message = customMessage || getErrorMessage(error);
      showToast(message, "error");
    },
    [showToast]
  );

  const handleAsyncError = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      context?: string,
      customErrorMessage?: string
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, context, customErrorMessage);
        return null;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleAsyncError,
  };
};

export default useErrorHandler;
