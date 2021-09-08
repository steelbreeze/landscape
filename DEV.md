# Development guide
Once cloned, update npm dependencies to install required tooling by entering:
```shell
npm update
```
## Build
To build, enter:
```shell
npm run build
```
The output will be under the folder ./lib/node with ./lib/index.js as the main entry point. It will also create a minified version under the folder ./lib/web.
## Document
To create the HTML documentation for the public API:
```shell
npm run document
```
