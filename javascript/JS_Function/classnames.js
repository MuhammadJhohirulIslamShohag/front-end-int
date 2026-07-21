/**
 * Custom implementation of the `classNames` utility function.
 * Conditionally joins classNames together from various data types (strings, numbers, objects, arrays).
 *
 * @param {...(string|number|Object|Array<any>)} args - Arguments of varying types to be processed.
 * @returns {string} Space-separated class names string.
 */

/* ============================================================================
 * 📐 INTERVIEW FRAMEWORK: How to Tackle the `classNames` Polyfill
 * ============================================================================
 *
 * ❓ CLARIFYING QUESTIONS TO ASK THE INTERVIEWER (1–2 mins)
 * ----------------------------------------------------------------------------
 * 1. Input & Output Signature:
 *    - "Should the function handle non-string primitive arguments like numbers or booleans?"
 *    - "What should it return if all arguments are empty or falsy? (An empty string?)"
 *
 * 2. Edge Cases & Special Data Types:
 *    - "How should falsy values (null, undefined, false, 0, "") be handled?"
 *    - "Are nested arrays possible, and should they be flattened recursively to any depth?"
 *    - "Should object properties on prototype chains or Symbol keys be ignored?"
 *
 * 3. Scope & Execution Context:
 *    - "Is modern ES6+ syntax (like `Object.hasOwn` and `for...of`) allowed in this environment?"
 *
 * 4. Mutation & Output Formatting:
 *    - "Should output class names be separated by single spaces without leading/trailing whitespace?"
 * ============================================================================
 *
 * 📝 CODE STEP-BY-STEP EXPLANATION
 * ----------------------------------------------------------------------------
 * - Step A (Falsy values): Loop over `args` using `for...of`. Skip falsy values immediately.
 * - Step B (Primitives): If string or number, push directly into `classes` array.
 * - Step C (Arrays): If array, recursively call `classNames(...arg)` to flatten any depth.
 * - Step D (Objects): Iterate using `for...in`. Check `Object.hasOwn(arg, key)` and truthiness.
 * - Step E (Formatting): Join `classes` using `.join(' ')` for clean space separation.
 *
 * 💡 INTERVIEW PRO TIPS:
 * - Use `Object.hasOwn()` over `hasOwnProperty()` to safely avoid prototype pollution/overrides.
 * - Use recursion for arrays to cleanly handle arbitrarily deep nested arrays.
 * - Array `.join(' ')` automatically handles single-space separation without extra trailing spaces.
 * ============================================================================
 */

export default function classNames(...args) {
  let classes = [];

  for (let arg of args) {
    // 1. Skip falsy values (null, undefined, false, 0, "")
    if (!arg) continue;

    let argType = typeof arg;

    // 2. Handle primitive types (strings and numbers)
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    }
    // 3. Recursively handle nested arrays
    else if (Array.isArray(arg)) {
      let innerClasses = classNames(...arg);
      if (innerClasses) {
        classes.push(innerClasses);
      }
    }
    // 4. Handle object key-value truthiness
    else if (argType === "object") {
      for (let key in arg) {
        if (Object.hasOwn(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  // 5. Return clean space-delimited string
  return classes.join(" ");
}
