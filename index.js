const _assert = require('assert');
const _state = require('./state').instance;
const _mock = require('./mock').instance;

process.on('beforeExit', () => {
  _state.terminate();
});

/**
 * @module ttf
 */
module.exports = {
  /**
   * Create a new test suite.
   *
   * @param {string} description - Suite description.
   * @param {function} fn - Function to run.
   * @param {object} options - Suite options
   * @example
   * ```js
   * const { suite, test, assertTrue } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be true', () => {
   *     assertTrue(true);
   *   });
   * });
   * ```
   */
  suite: (description, fn, options) =>
    _state.runSuite(description, fn, options),

  /**
   * Same as `suite(description, fn, {...options, skip: true})`
   *
   * @param {string} description - Suite description.
   * @param {function} fn - Function to run.
   * @param {object} options - Suite options
   */
  xsuite: (description, fn, options) =>
    _state.runSuite(description, fn, {...options, skip: true}),

  /**
   * Create a new test.
   *
   * @param {string} description - Test description.
   * @param {function} fn - Function to run.
   * @param {object} options - Test options
   * @example
   * ```js
   * const { suite, test, assertTrue } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be true', () => {
   *     assertTrue(true);
   *   });
   * });
   * ```
   */
  test: (description, fn, options) => _state.addTest(description, fn, options),

  /**
   * Same as `test(description, fn, {...options, skip: true})`
   *
   * @param {string} description - Test description.
   * @param {function} fn - Function to run.
   * @param {object} options - Test options
   */
  xtest: (description, fn, options) =>
    _state.addTest(description, fn, {...options, skip: true}),

  /**
   * Declare fn to run before each tests in the block.
   *
   * @param {function} fn - Function to run.
   * @example
   * ```js
   * const { suite, test, beforeEach, assertEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   let a;
   *
   *   beforeEach(() => {
   *     a = 3;
   *   });
   *
   *   test('sould be 3', () => {
   *     assertEqual(a, 3);
   *   });
   * });
   * ```
   */
  beforeEach: fn => _state.addBeforeEach(fn),

  /**
   * Declare fn to run after each tests in the block.
   *
   * @param {function} fn - Function to run.
   * @example
   * ```js
   * const { suite, test, afterEach, assertEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   let a;
   *
   *   afterEach(() => {
   *     a = undefined;
   *   });
   *
   *   test('sould be 3', () => {
   *     a = 3;
   *     assertNotEqual(a, 3);
   *   });
   * });
   * ```
   */
  afterEach: fn => _state.addAfterEach(fn),

  /**
   * Declare fn to run before all tests in the block.
   *
   * @param {function} fn - Function to run.
   * @example
   * ```js
   * const { suite, test, beforeEach, assertEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   let a;
   *
   *   beforeAll(() => {
   *     a = 3;
   *   });
   *
   *   test('sould be 3', () => {
   *     assertEqual(a, 3);
   *   });
   *
   *   test('sould be 3 as well', () => {
   *     assertEqual(a, 3);
   *   });
   * });
   * ```
   */
  beforeAll: fn => _state.addBeforeAll(fn),

  /**
   * Declare fn to run after all tests in the block.
   *
   * @param {function} fn - Function to run.
   * @example
   * ```js
   * const { suite, test, afterEach, assertEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   let a;
   *
   *   afterAll(() => {
   *     a = undefined;
   *   });
   *
   *   test('sould be 3', () => {
   *     a = 3;
   *     assertNotEqual(a, 3);
   *   });
   *
   *   test('sould be 3 as well', () => {
   *     assertEqual(a, 3);
   *   });
   * });
   * ```
   */
  afterAll: fn => _state.addAfterAll(fn),

  /**
   * Tests if value is truthy.
   *
   * @param {any} value - Value to test.
   * @example
   * ```js
   * const { suite, test, assertTrue } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be true', () => {
   *     assertTrue(true);
   *   });
   * });
   * ```
   */
  assertTrue: condition => {
    _state.addAssert();
    _assert(condition === true);
  },

  /**
   * Tests if value is falsy.
   *
   * @param {any} value - Value to test.
   * @example
   * ```js
   * const { suite, test, assertFalse } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be false', () => {
   *     assertFalse(false);
   *   });
   * });
   * ```
   */
  assertFalse: condition => {
    _state.addAssert();
    _assert(condition === false);
  },

  /**
   * Tests for deep equality between the actual and expected parameters.
   *
   * @param {any} actual - Value to test.
   * @param {any} expected - Expected value.
   * @example
   * ```js
   * const { suite, test, assertEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be equal', () => {
   *     assertEqual({a: 1}, {a: 1});
   *   });
   * });
   * ```
   */
  assertEqual: (actual, expected) => {
    _state.addAssert();
    _assert.deepStrictEqual(actual, expected);
  },

  /**
   * Tests for deep inequality between the actual and expected parameters.
   *
   * @param {any} actual - Value to test.
   * @param {any} expected - Expected value.
   * @example
   * ```js
   * const { suite, test, assertNotEqual } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould be equal', () => {
   *     assertEqual({a: 1}, {b: 2});
   *   });
   * });
   * ```
   */
  assertNotEqual: (actual, expected) => {
    _state.addAssert();
    _assert.notDeepStrictEqual(actual, expected);
  },

  /**
   * Expects the function fn to throw an error.
   *
   * @param {function} fn - Function to test.
   * @param {RegExp | Function | Object | Error} [error] - Expected error.
   * @param {string} [message] - Expected error message.
   * @example
   * ```js
   * const { suite, test, assertThrows } = require('ttf');
   *
   * suite('Simple suite', () => {
   *   test('sould throw an exception', () => {
   *     assertThrows(
   *       () => {
   *         call_undefined_function();
   *       },
   *       ReferenceError,
   *       'call_undefined_function is not defined',
   *     );
   *   });
   * });
   * ```
   */
  assertThrows: (fn, error, message) => {
    _state.addAssert();
    _assert.throws(fn, error, message);
  },

  /**
   * Expects mock call
   *
   * @param {module} module - Module of the function.
   * @param {string} fn - Function name.
   * @param {integer | Array} expected - Number of call expected or array of parameters.
   * @example
   * ```js
   * const {
   *   suite,
   *   test,
   *   assertEqual,
   *   mock,
   *   assertCall,
   *   beforeEach,
   *   afterEach,
   * } = require('ttf');
   * const fs = require('fs');
   *
   * suite('mock a nodejs module', () => {
   *   beforeEach(() => {
   *     mock.new(fs);
   *   });
   *
   *   afterEach(() => {
   *     mock.unload(fs);
   *   });
   *
   *   test('mock fs.stats', () => {
   *     mock.expect(fs, 'statSync', file => {
   *       return {mock: 'ok', file};
   *     });
   *
   *     const r = fs.statSync(__filename);
   *
   *     assertEqual(r, {mock: 'ok', file: __filename});
   *     assertCall(fs, 'statSync', 1);
   *     assertCall(fs, 'statSync', [__filename]);
   *   });
   * });
   * ```
   */
  assertCall: (module, fn, expected) => _mock.assertCall(module, fn, expected),

  /**
   * mock
   * @namespace
   */
  mock: {
    /**
     * Declare a new mock for the module.
     *
     * @param {module} module - Module to mock.
     * @example
     * ```js
     * const {
     *   suite,
     *   test,
     *   assertEqual,
     *   mock,
     *   assertCall,
     *   beforeEach,
     *   afterEach,
     * } = require('ttf');
     * const fs = require('fs');
     *
     * suite('mock a nodejs module', () => {
     *   beforeEach(() => {
     *     mock.new(fs);
     *   });
     *
     *   afterEach(() => {
     *     mock.unload(fs);
     *   });
     *
     *   test('mock fs.stats', () => {
     *     mock.expect(fs, 'statSync', file => {
     *       return {mock: 'ok', file};
     *     });
     *
     *     const r = fs.statSync(__filename);
     *
     *     assertEqual(r, {mock: 'ok', file: __filename});
     *     assertCall(fs, 'statSync', 1);
     *     assertCall(fs, 'statSync', [__filename]);
     *   });
     * });
     * ```
     *
     */
    new: module => _mock.new(module),

    /**
     * Unload mock for the module.
     *
     * @param {module} module - Module to mock.
     * @example
     * ```js
     * const {
     *   suite,
     *   test,
     *   assertEqual,
     *   mock,
     *   assertCall,
     *   beforeEach,
     *   afterEach,
     * } = require('ttf');
     * const fs = require('fs');
     *
     * suite('mock a nodejs module', () => {
     *   beforeEach(() => {
     *     mock.new(fs);
     *   });
     *
     *   afterEach(() => {
     *     mock.unload(fs);
     *   });
     *
     *   test('mock fs.stats', () => {
     *     mock.expect(fs, 'statSync', file => {
     *       return {mock: 'ok', file};
     *     });
     *
     *     const r = fs.statSync(__filename);
     *
     *     assertEqual(r, {mock: 'ok', file: __filename});
     *     assertCall(fs, 'statSync', 1);
     *     assertCall(fs, 'statSync', [__filename]);
     *   });
     * });
     * ```
     *
     */
    unload: module => _mock.unload(module),

    /**
     * Mock the function fname in module.
     *
     * @param {module} module - Module to mock.
     * @param {string} fname - Name of the function to mock in the module.
     * @param {function | mock.passthrough | any} [fn] - Mock result.
     *
     * @example
     * ```js
     * const {
     *   suite,
     *   test,
     *   assertEqual,
     *   mock,
     *   assertCall,
     *   beforeEach,
     *   afterEach,
     * } = require('ttf');
     * const fs = require('fs');
     *
     * suite('mock a nodejs module', () => {
     *   beforeEach(() => {
     *     mock.new(fs);
     *   });
     *
     *   afterEach(() => {
     *     mock.unload(fs);
     *   });
     *
     *   test('mock fs.stats', () => {
     *     mock.expect(fs, 'statSync', file => {
     *       return {mock: 'ok', file};
     *     });
     *
     *     const r = fs.statSync(__filename);
     *
     *     assertEqual(r, {mock: 'ok', file: __filename});
     *     assertCall(fs, 'statSync', 1);
     *     assertCall(fs, 'statSync', [__filename]);
     *   });
     * });
     * ```
     *
     */
    expect: (module, fname, fn) => _mock.expect(module, fname, fn),

    /**
     * Passthrough value for moxk.
     */
    passthrough: _mock.passthrough,
  },
};
