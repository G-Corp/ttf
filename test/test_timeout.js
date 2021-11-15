const {suite, test, assertTrue, assertFalse} = require('../index.js');

suite('Simple suite one', () => {
  test('wait 10000', () => {
    let a = 0;
    for(let i = 0; i < 10000000; i++) {
      a += i;
    }
    assertTrue(true);
  }, {timeout: 5});
});
