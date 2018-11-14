const { suite, test, assertTrue, assertFalse } = require('../index.js');

suite('Simple suite one', () => {
  test('true is true', () => {
    assertTrue(true);
  });

  test('false is false', () => {
    assertFalse(false);
  });
});
