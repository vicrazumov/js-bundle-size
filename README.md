# Javascript Bundle Size Cross-Browser Extension

Frontend developers frequently face the problem of choosing a proper library with a minimal footprint. [bundlephobia](https://bundlephobia.com) helps greatly by building bundles and providing their sizes minified and gzipped.

This cross-browser extension takes the next step, automatically requesting this data and adding it to:
* npm as a part of the right sidebar

![npm](https://github.com/vicrazumov/js-bundle-size/raw/master/images/npm.png)

* github at the top of the readme page

![github](https://github.com/vicrazumov/js-bundle-size/raw/master/images/github.png)

Tested in [Google Chrome 71](https://chrome.google.com/webstore/detail/javascript-bundle-size/aojdnjnhhjmokccbelfdocgiedioienh/) and [Mozilla Firefox 64.0.2](https://addons.mozilla.org/ru/firefox/addon/javascript-bundle-size/) on macOS 10.14.

## Notes
Please note, that Chrome doesn't require the `permissions` property in `manifest.json`, whereas Firefox doesn't allow `fetch` calls without that (even with mentioning the npm and github hosts explicitly).

## Contribution
Contributors' help is welcome, especially in bringing this to Edge, Opera, Safari and, maybe, other browsers.
