const assert = require('assert');
const { performance } = require('perf_hooks');

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

const NOTHING_FUNCTION = () => {};

const ST_SUITE = Symbol.for('ST.Test.Suite');
var globalSymbols = Object.getOwnPropertySymbols(global);
var hasSTSuite = globalSymbols.indexOf(ST_SUITE) > -1;
if (!hasSTSuite) {
  global[ST_SUITE] = {
    totalDuration: 0,
    testsCount: 0,
    assertsCount: 0,
    errors: [],
    suite: '',
    errorCount: 0,
    beforeAll: NOTHING_FUNCTION,
    afterAll: NOTHING_FUNCTION,
    beforeEach: NOTHING_FUNCTION,
    afterEach: NOTHING_FUNCTION,
    tests: [],

    addAssert: () => {
      global[ST_SUITE].assertsCount++;
    },

    addTest: (description, callback) => {
      global[ST_SUITE].tests.push({
        description,
        callback,
      });
    },

    addBeforeAll: callback => {
      global[ST_SUITE].beforeAll = callback;
    },
    addAfterAll: callback => {
      global[ST_SUITE].afterAll = callback;
    },
    addBeforeEach: callback => {
      global[ST_SUITE].beforeEach = callback;
    },
    addAfterEach: callback => {
      global[ST_SUITE].afterEach = callback;
    },

    runSuite: (description, callback) => {
      global[ST_SUITE].suite = description;
      callback();
      if (global[ST_SUITE].tests.length > 0) {
        global[ST_SUITE].beforeAll();
        global[ST_SUITE].tests.forEach(test => {
          global[ST_SUITE].beforeEach();
          try {
            const startDate = performance.now();
            test.callback();
            const endDate = performance.now();
            global[ST_SUITE].testsCount++;
            global[ST_SUITE].totalDuration += (endDate - startDate);
            process.stdout.write(`${GREEN}.${RESET}`);
          } catch (error) {
            process.stdout.write(`${RED}F${RESET}`);
            if (error instanceof assert.AssertionError) {
              global[ST_SUITE].errors.push({
                suite: global[ST_SUITE].suite,
                test: test.description,
                expected: error.expected,
                actual: error.actual,
                stacktrace: error.stack,
              });
            } else {
              global[ST_SUITE].errors.push({
                suite: global[ST_SUITE].suite,
                test: test.description,
                stacktrace: error.stack,
              });
            }
          }
          global[ST_SUITE].afterEach();
        });
        global[ST_SUITE].afterAll();
      }
      global[ST_SUITE].suite = '';
      global[ST_SUITE].tests = [];
      global[ST_SUITE].beforeEach = NOTHING_FUNCTION;
      global[ST_SUITE].afterEach = NOTHING_FUNCTION;
      global[ST_SUITE].beforeAll = NOTHING_FUNCTION;
      global[ST_SUITE].afterAll = NOTHING_FUNCTION;
    },

    terminate: () => {
      self = global[ST_SUITE];
      process.stdout.write('\n\n');
      process.stdout.write(
        `${GREEN}${self.testsCount} passed (${
          self.assertsCount
        } assertions)${RESET}`,
      );
      process.exitCode = self.errors.length;
      if (self.errors.length > 0) {
        process.stdout.write(' - ');
        process.stdout.write(`${RED}${self.errors.length} failed${RESET}`);
        process.stdout.write(` (${self.totalDuration.toFixed(2)} ms)`);
        process.stdout.write('\n');
        self.errors.forEach(error => {
          process.stdout.write('\n');
          process.stdout.write(
            `${self.errorCount++}) ${error.suite} - ${error.test} FAILED!\n`,
          );
          if (error.expected && error.actual) {
            process.stdout.write(
              `   expected: ${GREEN}${error.expected}${RESET}, actual: ${RED}${
                error.actual
              }${RESET}\n`,
            );
          }
          error.stacktrace.split(/\r?\n/).forEach(stackLine => {
            process.stdout.write(`${RED}   ${stackLine}${RESET}\n`);
          });
        });
      } else {
        process.stdout.write(` (${self.totalDuration.toFixed(2)} ms)`);
        process.stdout.write('\n');
      }
    },
  };
}

var singleton = {};

Object.defineProperty(singleton, 'instance', {
  get: () => {
    return global[ST_SUITE];
  },
});

Object.freeze(singleton);

module.exports = singleton;
