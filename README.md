# st - Simple Test for NodeJS

## Getting start

```
$ npm install git+https://github.com/glejeune/st.git --save-dev
$ mkdir test
$ $EDITOR test/test_suite.js
```

> All test suites file name *must* start with `test` and have a `.js` extension.

In your editor :

```
const { 
  suite,
  test,
  assertTrue,
  assertFalse,
  assertEqual,
  assertNotEqual
} = require('../index.js');

suite('Simple suite one', () => {
  test('sould be true', () => {
    assertTrue(true);
  });

  test('should be false', () => {
    assertFalse(false);
  });

  test('should return 4', () => {
    assertEqual(2 + 2, 4);
  });

  test('should not return 4', () => {
    assertNotEqual(2 + 3, 4);
  });
});
```

Then, to run the all test suites :

```
$ npx st test
```

To run on specific test suite :

```
$ npx st test/test_suite.js
```

or 

```
$ node test/test_suite.js
```

## Licence

Copyright (c) 2018, Grégoire Lejeune<br />
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
1. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
1. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.


THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.