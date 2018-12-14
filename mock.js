const state = require('./state').instance;
const assert = require('assert');

function createUID(strLength) {
  if (typeof strLength !== 'number' || strLength <= 0) return false;

  if (strLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 1; i <= strLength; i++) {
      str += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
    }
    return str;
  } else {
    return false;
  }
}

const ST_MOCK = Symbol.for('ST.Test.Mock');
let globalSymbols = Object.getOwnPropertySymbols(global);
let hasSTMock = globalSymbols.indexOf(ST_MOCK) > -1;
if (!hasSTMock) {
  global[ST_MOCK] = {
    mocks: {},

    new: module => {
      if (typeof module === 'object' && !module.__stTestMockUID) {
        module.__stTestMockUID = createUID(20);
        global[ST_MOCK].mocks[module.__stTestMockUID] = {
          calls: {},
          originals: {},
        };
      }
    },

    unload: module => {
      if (typeof module === 'object' && module.__stTestMockUID) {
        Object.keys(
          global[ST_MOCK].mocks[module.__stTestMockUID].originals,
        ).forEach(funName => {
          module[funName] =
            global[ST_MOCK].mocks[module.__stTestMockUID].originals[funName];
        });
        delete global[ST_MOCK].mocks[module.__stTestMockUID];
        delete module.__stTestMockUID;
      }
    },

    expect: (module, funName, fun) => {
      if (typeof module === 'object' && module.__stTestMockUID) {
        global[ST_MOCK].mocks[module.__stTestMockUID].originals[funName] =
          module[funName];
        module[funName] = (...args) => {
          global[ST_MOCK].mocks[module.__stTestMockUID].calls[funName] = [
            ...(global[ST_MOCK].mocks[module.__stTestMockUID].calls[funName] ||
              []),
            args,
          ];
          return fun(...args);
        };
      } else {
        throw new Error('module not mocked');
      }
    },

    assertCall: (module, funName, countOrParams) => {
      state.addAssert();
      if (typeof module === 'object' && module.__stTestMockUID) {
        if (typeof countOrParams === 'number') {
          assert.equal(
            global[ST_MOCK].mocks[module.__stTestMockUID].calls[funName].length,
            countOrParams,
          );
        } else if (typeof countOrParams === 'object') {
          let found = false;
          global[ST_MOCK].mocks[module.__stTestMockUID].calls[funName].forEach(
            v => {
              try {
                assert.deepStrictEqual(v, countOrParams);
                found = true;
              } catch (_) {}
            },
          );
          if (found) {
            assert.ok(true);
          } else {
            throw new assert.AssertionError({
              actual: [],
              expected: countOrParams,
              operator: 'assertCall',
              stackStartFn: global[ST_MOCK].assertCall,
            });
          }
        } else {
          throw new Error('invalid parameter');
        }
      } else {
        throw new Error('module not mocked');
      }
    },
  };
}

const singleton = {};

Object.defineProperty(singleton, 'instance', {
  get: () => {
    return global[ST_MOCK];
  },
});

Object.freeze(singleton);

module.exports = singleton;
