import { useCallback, useMemo } from "react";

// Type for any object that can be compared
type ComparableObject = Record<string, unknown>;

/**
 * Custom hook for detecting changes in form data
 */
export const useFormChangeDetection = <T extends ComparableObject>(
  original: T,
  current: T,
  options: {
    ignoreKeys?: (keyof T)[];
    enableLogging?: boolean;
  } = {}
) => {
  const {
    ignoreKeys = ["id", "created_at", "updated_at", "user_id"],
    enableLogging = false,
  } = options;

  // Import change detection utility
  const getChangedFields = useCallback(async () => {
    const { getChangedFields: getChanges } = await import(
      "@/utils/change-detection"
    );
    return getChanges(original, current, ignoreKeys);
  }, [original, current, ignoreKeys]);

  // Memoized change detection results
  const changeDetection = useMemo(() => {
    // Simple deep comparison for immediate UI feedback
    const hasChanges = !deepEqual(original, current, ignoreKeys);

    if (enableLogging) {
      console.log("Form change detection:", {
        hasChanges,
        original: filterObject(original, ignoreKeys),
        current: filterObject(current, ignoreKeys),
      });
    }

    return {
      hasChanges,
      isDirty: hasChanges,
      isClean: !hasChanges,
    };
  }, [original, current, ignoreKeys, enableLogging]);

  return {
    ...changeDetection,
    getChangedFields,
  };
};

/**
 * Simplified deep comparison for UI responsiveness
 */
const deepEqual = <T extends ComparableObject>(
  obj1: T,
  obj2: T,
  ignoreKeys: (keyof T)[] = []
): boolean => {
  const keys1 = Object.keys(obj1).filter((key) => !ignoreKeys.includes(key));
  const keys2 = Object.keys(obj2).filter((key) => !ignoreKeys.includes(key));

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (val1 === val2) {
      continue;
    }

    // Handle null/undefined comparison
    if (val1 == null || val2 == null) {
      return val1 === val2;
    }

    // Handle dates
    if (val1 instanceof Date && val2 instanceof Date) {
      if (val1.getTime() !== val2.getTime()) {
        return false;
      }
      continue;
    }

    // Handle objects (recursive)
    if (
      typeof val1 === "object" &&
      typeof val2 === "object" &&
      val1 !== null &&
      val2 !== null
    ) {
      if (!deepEqual(val1 as ComparableObject, val2 as ComparableObject, [])) {
        return false;
      }
      continue;
    }

    // Handle arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        return false;
      }
      for (let i = 0; i < val1.length; i++) {
        if (!deepEqual({ a: val1[i] }, { a: val2[i] }, [])) {
          return false;
        }
      }
      continue;
    }

    // Primitive comparison
    if (val1 !== val2) {
      return false;
    }
  }

  return true;
};

/**
 * Filter object by removing ignored keys
 */
const filterObject = <T extends ComparableObject>(
  obj: T,
  ignoreKeys: (keyof T)[]
): Partial<T> => {
  const filtered: Partial<T> = {};
  for (const key in obj) {
    if (!ignoreKeys.includes(key)) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
};

export default useFormChangeDetection;
