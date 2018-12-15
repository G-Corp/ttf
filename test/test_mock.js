const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('../index.js');

const testMod = {
  foo(x, y) {
    return this.bar(x, y);
  },

  bar(x, y) {
    return x + y;
  }
};

suite('mock a nodejs module', () => {
  beforeEach(() => {
    mock.new(testMod);
  });

  afterEach(() => {
    mock.unload(testMod);
  });

  test('mock testMod.bar with a function', () => {
    mock.expect(testMod, 'bar', (x, y) => {
      return x * y;
    });

    const r = testMod.foo(3, 4);

    assertEqual(r, 12),
    assertCall(testMod, 'bar', 1);
    assertCall(testMod, 'bar', [3, 4]);
  });

  test('mock testMod.bar with a value', () => {
    mock.expect(testMod, 'bar', 42);

    const r = testMod.foo(3, 4);

    assertEqual(r, 42),
    assertCall(testMod, 'bar', 1);
    assertCall(testMod, 'bar', [3, 4]);
  });

  test('mock testMod.bar and allow passthrough', () => {
    mock.expect(testMod, 'bar', mock.passthrough);

    const r = testMod.foo(3, 4);

    assertEqual(r, 7),
    assertCall(testMod, 'bar', 1);
    assertCall(testMod, 'bar', [3, 4]);
  });
});
