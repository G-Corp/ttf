const {suite, xtest, test, assertTrue, assertFalse} = require('../index.js');

suite('Skip test', () => {
  test('not skipped', () => {
    assertTrue(true);
  });

  xtest('skipped', () => {
    assertTrue(false);
  });
});
