const { suite, test, assertThrows } = require('../../index.js');

suite('Tests in sub dir', () => {
  test('true is true', () => {
    assertThrows(
      () => {
        call_undefined_function();
      },
      ReferenceError,
      'call_undefined_function is not defined'
    );
  });
});
