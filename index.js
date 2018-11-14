const assert = require('assert');
const state = require('./state').instance;

process.on('beforeExit', () => { 
  state.terminate(); 
});

module.exports = {
  assertTrue: (condition) => {
    state.addAssert();
    assert((condition) === true)
  },
  assertFalse: (condition) => {
    state.addAssert();
    assert((condition) === false)
  },
  assertEqual: (actual, expected) => {
    state.addAssert();
    assert.equal(actual, expected)
  },
  assertNotEqual: (actual, expected) => {
    state.addAssert();
    assert.notEqual(actual, expected)
  },
  assertThrows: (callback, error, message) => {
    state.addAssert();
    assert.throws(callback, error, message);
  },

  beforeEach: (callback) => state.addBeforeEach(callback),
  afterEach: (callback) => state.addAfterEach(callback),
  beforeAll: (callback) => state.addBeforeAll(callback),
  afterAll: (callback) => state.addAfterAll(callback),

  suite: (description, callback) => state.runSuite(description, callback),

  test: (description, callback) => {
    state.addTest(description, callback);
  },
};
