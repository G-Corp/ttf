const {xsuite, test, assertTrue, assertFalse} = require('../index.js');

xsuite('Skip test', () => {
  test('skipped', () => {
    assertTrue(false);
  });

  test('also skipped', () => {
    assertFalse(true);
  });
});
