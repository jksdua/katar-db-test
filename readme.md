Katar Db Test Suite
===================

Test suite for testing data adapters for katar.

The test suite uses the `main` property in `package.json` to import the data adapter.


Usage
-----

Install dependencies

```
npm install mocha -g
```

Install the test suite using:

```
npm install katar-db-test --save-dev
```

Add a test command in your data adapter's `package.json`. Example scripts section from `katar-memorydb` is shown below:

```js
  "scripts": {
    "test": "mocha --harmony --bail --timeout 5000 ./node_modules/katar-db-test"
  }
```

If the data adapter requires an options object to initialise, add this in `package.json` like shown below:

```js
	"custom": {
		"testOptions": "localhost/db"
	}
``` 

Run tests using

```
npm test
```


Changelog
---------

### v0.0.3
- Updated readme - added details on how to add adapter options to be used by the test suite when initialising the adapter

### v0.0.2
- Updated readme

### v0.0.1 - Alpha
- Initial release