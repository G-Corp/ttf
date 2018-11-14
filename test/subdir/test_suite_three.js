const { suite, test, assertTrue, assertFalse } = require('../../index.js');

suite('Tests in sub dir', () => {
  test('true is true', () => {
    assertTrue(true);
  });

  test('false is false', () => {
    assertFalse(false);
  });
});
