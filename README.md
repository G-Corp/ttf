# ttf - Tiny Test Framework (for NodeJS)

[![Build Status](https://img.shields.io/travis/G-Corp/ttf.svg?style=flat-square)](https://travis-ci.org/G-Corp/ttf)
[![Version](https://img.shields.io/npm/v/ttf.svg?style=flat-square)](https://www.npmjs.com/package/ttf)
[![License](https://img.shields.io/github/license/G-Corp/ttf.svg?style=flat-square)](https://github.com/G-Corp/ttf/blob/master/LICENSE)
[![Issues](https://img.shields.io/github/issues/G-Corp/ttf.svg?style=flat-square)](https://github.com/G-Corp/ttf/issues)

## Getting start

```
$ npm install git+https://github.com/g-corp/ttf.git --save-dev
$ mkdir test
$ $EDITOR test/test_suite.js
```

> All test suites file name *must* start with `test` and have a `.js` extension.

In your editor :

```js
const fs = require('fs');
const { 
  suite,
  test,
  mock,
  beforeEach,
  afterEach,
  assertTrue,
  assertFalse,
  assertEqual,
  assertNotEqual,
  assertCall,
  assertThrows
} = require('ttf');

suite('Simple suite one', () => {
  beforeEach(() => {
    mock.new(fs);
  });

  afterEach(() => {
    mock.unload(fs);
  });

  test('should mock fs.statSync', () => {
    mock.expect(fs, 'statSync', file => {
      return {mock: 'ok', file};
    });

    const r = fs.statSync(__filename);

    assertEqual(r, {mock: 'ok', file: __filename});
    assertCall(fs, 'statSync', 1);
    assertCall(fs, 'statSync', [__filename]);
  });

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

  test('should throw an exception', () => {
    assertThrows(
      () => {
        call_undefined_function();
      },
      ReferenceError,
      'call_undefined_function is not defined',
    );
  });
});
```

Then, to run the all test suites :

```
$ npx ttf test
```

To run on specific test suite :

```
$ npx ttf test/test_suite.js
```

or 

```
$ node test/test_suite.js
```
## API Reference

* [ttf](#module_ttf)
    * [.mock](#module_ttf.mock) : <code>object</code>
        * [.new(module)](#module_ttf.mock.new)
        * [.unload(module)](#module_ttf.mock.unload)
        * [.expect(module, fname, fn)](#module_ttf.mock.expect)
    * [.suite(description, fn)](#module_ttf.suite)
    * [.test(description, fn)](#module_ttf.test)
    * [.beforeEach(fn)](#module_ttf.beforeEach)
    * [.afterEach(fn)](#module_ttf.afterEach)
    * [.beforeAll(fn)](#module_ttf.beforeAll)
    * [.afterAll(fn)](#module_ttf.afterAll)
    * [.assertTrue(value)](#module_ttf.assertTrue)
    * [.assertFalse(value)](#module_ttf.assertFalse)
    * [.assertEqual(actual, expected)](#module_ttf.assertEqual)
    * [.assertNotEqual(actual, expected)](#module_ttf.assertNotEqual)
    * [.assertThrows(fn, [error], [message])](#module_ttf.assertThrows)
    * [.assertCall(module, fn, expected)](#module_ttf.assertCall)

<a name="module_ttf.mock"></a>

### ttf.mock : <code>object</code>
mock

**Kind**: static namespace of [<code>ttf</code>](#module_ttf)  

* [.mock](#module_ttf.mock) : <code>object</code>
    * [.new(module)](#module_ttf.mock.new)
    * [.unload(module)](#module_ttf.mock.unload)
    * [.expect(module, fname, fn)](#module_ttf.mock.expect)

<a name="module_ttf.mock.new"></a>

#### mock.new(module)
Declare a new mock for the module.

**Kind**: static method of [<code>mock</code>](#module_ttf.mock)  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>module</code> | Module to mock. |

**Example**  
```js
const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('ttf');
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
```
<a name="module_ttf.mock.unload"></a>

#### mock.unload(module)
Unload mock for the module.

**Kind**: static method of [<code>mock</code>](#module_ttf.mock)  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>module</code> | Module to mock. |

**Example**  
```js
const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('ttf');
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
```
<a name="module_ttf.mock.expect"></a>

#### mock.expect(module, fname, fn)
Mock the function fname in module with fn.

**Kind**: static method of [<code>mock</code>](#module_ttf.mock)  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>module</code> | Module to mock. |
| fname | <code>string</code> | Name of the function to mock in the module. |
| fn | <code>function</code> | Mock function. |

**Example**  
```js
const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('ttf');
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
```
<a name="module_ttf.suite"></a>

### ttf.suite(description, fn)
Create a new test suite.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | Suite description. |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, assertTrue } = require('ttf');

suite('Simple suite', () => {
  test('sould be true', () => {
    assertTrue(true);
  });
});
```
<a name="module_ttf.test"></a>

### ttf.test(description, fn)
Create a new test.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| description | <code>string</code> | Test description. |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, assertTrue } = require('ttf');

suite('Simple suite', () => {
  test('sould be true', () => {
    assertTrue(true);
  });
});
```
<a name="module_ttf.beforeEach"></a>

### ttf.beforeEach(fn)
Declare fn to run before each tests in the block.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, beforeEach, assertEqual } = require('ttf');

suite('Simple suite', () => {
  let a;

  beforeEach(() => {
    a = 3;
  });

  test('sould be 3', () => {
    assertEqual(a, 3);
  });
});
```
<a name="module_ttf.afterEach"></a>

### ttf.afterEach(fn)
Declare fn to run after each tests in the block.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, afterEach, assertEqual } = require('ttf');

suite('Simple suite', () => {
  let a;

  afterEach(() => {
    a = undefined;
  });

  test('sould be 3', () => {
    a = 3;
    assertNotEqual(a, 3);
  });
});
```
<a name="module_ttf.beforeAll"></a>

### ttf.beforeAll(fn)
Declare fn to run before all tests in the block.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, beforeEach, assertEqual } = require('ttf');

suite('Simple suite', () => {
  let a;

  beforeAll(() => {
    a = 3;
  });

  test('sould be 3', () => {
    assertEqual(a, 3);
  });

  test('sould be 3 as well', () => {
    assertEqual(a, 3);
  });
});
```
<a name="module_ttf.afterAll"></a>

### ttf.afterAll(fn)
Declare fn to run after all tests in the block.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to run. |

**Example**  
```js
const { suite, test, afterEach, assertEqual } = require('ttf');

suite('Simple suite', () => {
  let a;

  afterAll(() => {
    a = undefined;
  });

  test('sould be 3', () => {
    a = 3;
    assertNotEqual(a, 3);
  });

  test('sould be 3 as well', () => {
    assertEqual(a, 3);
  });
});
```
<a name="module_ttf.assertTrue"></a>

### ttf.assertTrue(value)
Tests if value is truthy.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | Value to test. |

**Example**  
```js
const { suite, test, assertTrue } = require('ttf');

suite('Simple suite', () => {
  test('sould be true', () => {
    assertTrue(true);
  });
});
```
<a name="module_ttf.assertFalse"></a>

### ttf.assertFalse(value)
Tests if value is falsy.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | Value to test. |

**Example**  
```js
const { suite, test, assertFalse } = require('ttf');

suite('Simple suite', () => {
  test('sould be false', () => {
    assertFalse(false);
  });
});
```
<a name="module_ttf.assertEqual"></a>

### ttf.assertEqual(actual, expected)
Tests for deep equality between the actual and expected parameters.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>any</code> | Value to test. |
| expected | <code>any</code> | Expected value. |

**Example**  
```js
const { suite, test, assertEqual } = require('ttf');

suite('Simple suite', () => {
  test('sould be equal', () => {
    assertEqual({a: 1}, {a: 1});
  });
});
```
<a name="module_ttf.assertNotEqual"></a>

### ttf.assertNotEqual(actual, expected)
Tests for deep inequality between the actual and expected parameters.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| actual | <code>any</code> | Value to test. |
| expected | <code>any</code> | Expected value. |

**Example**  
```js
const { suite, test, assertNotEqual } = require('ttf');

suite('Simple suite', () => {
  test('sould be equal', () => {
    assertEqual({a: 1}, {b: 2});
  });
});
```
<a name="module_ttf.assertThrows"></a>

### ttf.assertThrows(fn, [error], [message])
Expects the function fn to throw an error.

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to test. |
| [error] | <code>RegExp</code> \| <code>function</code> \| <code>Object</code> \| <code>Error</code> | Expected error. |
| [message] | <code>string</code> | Expected error message. |

**Example**  
```js
const { suite, test, assertThrows } = require('ttf');

suite('Simple suite', () => {
  test('sould throw an exception', () => {
    assertThrows(
      () => {
        call_undefined_function();
      },
      ReferenceError,
      'call_undefined_function is not defined',
    );
  });
});
```
<a name="module_ttf.assertCall"></a>

### ttf.assertCall(module, fn, expected)
Expects mock call

**Kind**: static method of [<code>ttf</code>](#module_ttf)  

| Param | Type | Description |
| --- | --- | --- |
| module | <code>module</code> | Module of the function. |
| fn | <code>string</code> | Function name. |
| expected | <code>integer</code> \| <code>Array</code> | Number of call expected or array of parameters. |

**Example**  
```js
const {
  suite,
  test,
  assertEqual,
  mock,
  assertCall,
  beforeEach,
  afterEach,
} = require('ttf');
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
```

## Licence

Copyright (c) 2018, Grégoire Lejeune<br />
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
1. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
1. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.


THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
