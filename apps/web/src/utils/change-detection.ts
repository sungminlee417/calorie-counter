/**
 * Utilities for detecting changes in entities before database updates
 */

// Type for any object that can be compared
type ComparableObject = Record<string, unknown>;

/**
 * Deep comparison of two objects, ignoring specified keys
 */
export const deepEqual = <T extends ComparableObject>(
  obj1: T | Partial<T>,
  obj2: T | Partial<T>,
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
    if (typeof val1 === "object" && typeof val2 === "object") {
      if (!deepEqual(val1, val2)) {
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
        if (!deepEqual({ a: val1[i] }, { a: val2[i] })) {
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
 * Generic function to check if an entity has changes compared to its original state
 */
export const hasEntityChanges = <T extends ComparableObject>(
  original: T,
  updated: Partial<T>,
  ignoreKeys: (keyof T)[] = ["id", "created_at", "updated_at", "user_id"]
): boolean => {
  // Create a merged object with only the fields that could have changed
  const relevantOriginal: Partial<T> = {};
  const relevantUpdated: Partial<T> = {};

  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(original),
    ...Object.keys(updated),
  ]) as Set<keyof T>;

  // Filter out ignored keys and build comparison objects
  for (const key of allKeys) {
    if (!ignoreKeys.includes(key)) {
      if (key in original) {
        relevantOriginal[key] = original[key];
      }
      if (key in updated) {
        relevantUpdated[key] = updated[key];
      }
    }
  }

  // If updated object has no relevant keys, no changes
  if (Object.keys(relevantUpdated).length === 0) {
    return false;
  }

  // Create full comparison objects
  const originalWithUpdates = { ...relevantOriginal, ...relevantUpdated };

  return !deepEqual(relevantOriginal, originalWithUpdates, ignoreKeys);
};

/**
 * Extract only changed fields from an update object compared to original
 */
export const getChangedFields = <T extends ComparableObject>(
  original: T,
  updated: Partial<T>,
  ignoreKeys: (keyof T)[] = ["id", "created_at", "updated_at", "user_id"]
): Partial<T> => {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (ignoreKeys.includes(key)) {
      continue;
    }

    const originalValue = original[key];
    const updatedValue = updated[key];

    // Use deep comparison for individual fields
    if (!deepEqual({ [key]: originalValue }, { [key]: updatedValue })) {
      changes[key] = updatedValue;
    }
  }

  return changes;
};

/**
 * Specific change detection for different entity types
 */

export interface ChangeDetectionResult<T> {
  hasChanges: boolean;
  changedFields: Partial<T>;
  message: string;
}

/**
 * Check for changes in food entries
 */
export const checkFoodEntryChanges = (
  original: ComparableObject,
  updated: Partial<ComparableObject>
): ChangeDetectionResult<ComparableObject> => {
  const changedFields = getChangedFields(original, updated);
  const hasChanges = Object.keys(changedFields).length > 0;

  return {
    hasChanges,
    changedFields,
    message: hasChanges
      ? `Food entry has changes in: ${Object.keys(changedFields).join(", ")}`
      : "No changes detected in food entry",
  };
};

/**
 * Check for changes in food items
 */
export const checkFoodChanges = (
  original: ComparableObject,
  updated: Partial<ComparableObject>
): ChangeDetectionResult<ComparableObject> => {
  const changedFields = getChangedFields(original, updated);
  const hasChanges = Object.keys(changedFields).length > 0;

  return {
    hasChanges,
    changedFields,
    message: hasChanges
      ? `Food has changes in: ${Object.keys(changedFields).join(", ")}`
      : "No changes detected in food",
  };
};

/**
 * Check for changes in macro goals
 */
export const checkMacroGoalChanges = (
  original: ComparableObject,
  updated: Partial<ComparableObject>
): ChangeDetectionResult<ComparableObject> => {
  const changedFields = getChangedFields(original, updated);
  const hasChanges = Object.keys(changedFields).length > 0;

  return {
    hasChanges,
    changedFields,
    message: hasChanges
      ? `Macro goal has changes in: ${Object.keys(changedFields).join(", ")}`
      : "No changes detected in macro goal",
  };
};
