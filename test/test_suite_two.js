const {
  suite,
  test,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  assertEqual,
} = require('../index.js');

let x = 0;

suite('Simple suite two', () => {
  beforeAll(() => {
    assertEqual(x, 0);
    x++;
  });

  afterAll(() => {
    x--;
    assertEqual(x, 0);
  });

  beforeEach(() => {
    x++;
  });

  afterEach(() => {
    x--;
  });

  test('true is true', () => {
    assertEqual(x, 2);
  });

  test('false is false', () => {
    assertEqual(x, 2);
  });
});
