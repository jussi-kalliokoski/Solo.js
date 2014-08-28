# Solo.js

[![Build Status](https://travis-ci.org/jussi-kalliokoski/solo.svg)](https://travis-ci.org/jussi-kalliokoski/solo)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/solo.svg)](https://coveralls.io/r/jussi-kalliokoski/solo)

Solo.js is a tiny (under 1kb minified, under 0.5kb minified and gzipped) ES6 Promise-based library to build task queues where you can have only one async task running at any given time. This is useful for example when you have a network operation whose result you'll cache, and you need to make sure that if the thing is invoked multiple times, it doesn't touch network more than once.

## Getting Started

To get started, grab the latest copy of Solo.js:

### npm

```sh
$ npm install --save solo
```

### bower

```sh
$ bower install --save solo
```

## Usage

### CommonJS (node / browserify)

```javascript
var Solo = require("solo");

var queue = Solo();

queue(function () {
    // Do something that returns a promise.
});

queue(function () {
    // Do something else that returns a promise.
});
```

### Others

Solo.js has an UMD-wrapper, so it can also be used with AMD loaders such as RequireJS, or without a script loader, exporting a global variable `Solo`.

## Browser Support

Courtesy of the test suite that's run on [BrowserStack](https://www.browserstack.com/), the officially supported browsers are as follows:

* Chrome: Latest stable version.
* Firefox: Latest stable version.
* Opera: Latest stable version.
* Internet Explorer: 8, 9, 10, 11.

## Contributing

Contributions are most welcome! If you're having problems and don't know why, search the issues to see if someone's had the same issue. If not, file a new issue so we can solve it together and leave the solution visible to others facing the same problem as well. If you find bugs, file an issue, preferably with good reproduction steps. If you want to be totally awesome, you can make a PR to go with your issue, containing a new test case that fails currently!

### Development

Development is pretty straightforward, it's all JS and the standard node stuff works:

To install dependencies:

```bash
$ npm install
```

To run the tests:

```bash
$ npm test
```

Then just make your awesome feature and a PR for it. Don't forget to file an issue first, or start with an empty PR so others can see what you're doing and discuss it so there's a a minimal amount of wasted effort.

Do note that the test coverage is currently a whopping 100%. Let's keep it that way! Remember: if it's not in the requirements specification (i.e. the tests), it's not needed, and thus unnecessary bloat.
