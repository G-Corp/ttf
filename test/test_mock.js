const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('../index.js');
const fs = require('fs');

suite('mock a nodejs module', () => {
  beforeEach(() => {
    mock.new(fs);
  });

  afterEach(() => {
    mock.unload(fs);
  });

  test('mock fs.stats', () => {
    mock.expect(fs, 'statSync', file => {
      return {mock: 'ok', file};
    });

    const r = fs.statSync(__filename);

    assertEqual(r, {mock: 'ok', file: __filename});
    assertCall(fs, 'statSync', 1);
    assertCall(fs, 'statSync', [__filename]);
  });
});
