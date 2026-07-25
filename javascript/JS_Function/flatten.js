/**
 * Recursively flattens a nested array into a single-level array.
 *
 * @param {Array} value - The input array (can contain primitives or nested arrays).
 * @returns {Array} A new flat array containing all elements.
 */
const flatten = (value) => {
  // Step 1: Create an empty array to store the flattened elements
  const result = [];

  // Step 2: Loop through every item in the input array one by one
  for (const val of value) {
    // Step 3: Check if the current item is itself an array
    if (Array.isArray(val)) {
      // Step 4a: If it IS an array, recursively call flatten on it,
      // then spread (...) its individual elements and push them into result
      result.push(...flatten(val));
    } else {
      // Step 4b: If it IS NOT an array (e.g., number, string, object),
      // push the value directly into the result array
      result.push(val);
    }
  }

  // Step 5: Return the fully flattened result array
  return result;
};

// Example usage:
console.log(flatten([1, 2, [3, 4, 5]])); // Output: [1, 2, 3, 4, 5]
