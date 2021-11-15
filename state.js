const assert = require('assert');
const {performance} = require('perf_hooks');

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

const NOTHING_FUNCTION = () => {};
const DEFAULT_TIMEOUT = 3000;

const ST_SUITE = Symbol.for('ST.Test.Suite');
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasSTSuite = globalSymbols.indexOf(ST_SUITE) > -1;
if (!hasSTSuite) {
  global[ST_SUITE] = {
    totalDuration: 0,
    totalSkipped: 0,
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

    addTest: (description, callback, options) => {
      global[ST_SUITE].tests.push({
        ...options,
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

    runSuite: (description, callback, options) => {
      const self = global[ST_SUITE];
      self.suite = description;
      callback();
      if (self.tests.length > 0) {
        if (!options || !options.skip) {
          self.beforeAll();
        }
        self.tests.forEach(test => {
          if ((!options || !options.skip) && !test.skip) {
            let timeoutID;
            let runID;

            const timeout =
              test.timeout || (options && options.timeout) || DEFAULT_TIMEOUT;

            self.beforeEach();

            const timeoutPromise = new Promise((resolve, reject) => {
              console.log('START TIEMOUT', timeout);
              timeoutID = setTimeout(() => {
                console.log(test.description, ': SEND ERROR');
                reject(new Error('timeout'));
                clearTimeout(timeoutID);
                clearTimeout(runID);
              }, timeout);
            });

            const execPromise = new Promise((resolve, reject) => {
              runID = setTimeout(() => {
                const startDate = performance.now();
                try {
                  test.callback();
                  const endDate = performance.now();
                  console.log(test.description, ': SEND ', endDate - startDate);
                  resolve(endDate - startDate);
                } catch (error) {
                  reject(error);
                }
                clearTimeout(timeoutID);
                clearTimeout(runID);
              }, 0);
            });

            const runner = Promise.race([execPromise, timeoutPromise]);
            runner
              .then(response => {
                self.testsCount++;
                self.totalDuration += response;
                process.stdout.write(`${GREEN}.${RESET}`);
              })
              .catch(error => {
                process.stdout.write(`${RED}F${RESET}`);
                if (error instanceof assert.AssertionError) {
                  self.errors.push({
                    suite: self.suite,
                    test: test.description,
                    expected: error.expected,
                    actual: error.actual,
                    stacktrace: error.stack,
                  });
                } else {
                  self.errors.push({
                    suite: self.suite,
                    test: test.description,
                    stacktrace: error.stack,
                  });
                }
              });

            self.afterEach();
          } else {
            process.stdout.write(`${YELLOW}S${RESET}`);
            self.totalSkipped++;
          }
        });
        if (!options || !options.skip) {
          self.afterAll();
        }
      }
      self.suite = '';
      self.tests = [];
      self.beforeEach = NOTHING_FUNCTION;
      self.afterEach = NOTHING_FUNCTION;
      self.beforeAll = NOTHING_FUNCTION;
      self.afterAll = NOTHING_FUNCTION;
    },

    terminate: () => {
      const self = global[ST_SUITE];
      process.stdout.write('\n\n');
      process.stdout.write(
        `${GREEN}${self.testsCount} passed (${
          self.assertsCount
        } assertions)${RESET}`,
      );
      if (self.totalSkipped) {
        process.stdout.write(' - ');
        process.stdout.write(`${YELLOW}${self.totalSkipped} skipped${RESET}`);
      }
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
