/**
 * Polyfill for `Array.prototype.reduce`
 *
 * Executes a user-supplied "reducer" callback function on each element of the array,
 * in order, passing in the return value from the calculation on the preceding element.
 *
 * @template T, U
 * @param {(previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U} callbackFn
 *        Function to execute on each element in the array.
 * @param {U} [initialValue]
 *        Value to use as the first argument to the first call of callbackFn.
 * @returns {U} The final accumulated result from running the reducer.
 * @throws {TypeError} If array is null/undefined, callbackFn is not a function, or array is empty without initialValue.
 */

/* ============================================================================
 * 📐 INTERVIEW FRAMEWORK: Tackling Polyfill Questions
 * ============================================================================
 *
 * 1. CLARIFY REQUIREMENTS & SPECS (2–3 mins)
 *    - Inputs & Outputs: "What arguments does callbackFn take? (acc, val, index, array)"
 *    - Optional Arguments: "Can initialValue be passed?"
 *    - Execution Context: "Does it accept thisArg?" (Note: `reduce` does NOT, unlike `map`/`filter`).
 *
 * 2. IDENTIFY EDGE CASES OUT LOUD (2 mins)
 *    - Null / Undefined Target: Throw TypeError if called on null/undefined.
 *    - Empty Array + No Initial Value: Throw TypeError ('Reduce of empty array with no initial value').
 *    - Missing Initial Value: First present element becomes accumulator, iteration starts at next index.
 *    - Sparse Arrays: Holes (e.g., [1, , 3]) must be skipped during iteration.
 * ============================================================================
 */

Array.prototype.myReduce = function (callbackFn, initialValue) {
  // 1. Guard against null or undefined context
  if (this == null) {
    throw new TypeError("Array.prototype.myReduce called on null or undefined");
  }

  // 2. Ensure callback is a valid function
  if (typeof callbackFn !== "function") {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  let accumulator;
  let startIdx = 0;
  const len = this.length >>> 0; // Ensures non-negative integer representation
  const hasInitialValue = arguments.length > 1;

  if (hasInitialValue) {
    accumulator = initialValue;
  } else {
    // Find the first present index (skips sparse holes)
    let k = 0;
    while (k < len && !Object.hasOwn(this, k)) {
      k++;
    }

    // Handle empty array with no initial value
    if (k >= len) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = this[k];
    startIdx = k + 1;
  }

  // 3. Process remaining elements, skipping sparse array gaps
  for (let i = startIdx; i < len; i++) {
    if (Object.hasOwn(this, i)) {
      accumulator = callbackFn(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};
