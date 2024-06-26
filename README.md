# landscape
[![Maintainability](https://api.codeclimate.com/v1/badges/1106fd03a5f0df4cf80f/maintainability)](https://codeclimate.com/github/steelbreeze/landscape/maintainability)

Landscape map visualisation of data.

![landscape map viewpoint](https://steelbreeze.net/landscape/images/landscape-map.png)

This library produces visualisations of data that conform to the [Archimate Landscape Map Viewpoint](https://pubs.opengroup.org/architecture/archimate2-doc/chap08.html#_Toc371945248).

The tool takes as an input a cube of data generated by [@steelbreeze/pivot](https://github.com/steelbreeze/pivot) along with the axes used to create it. It generates the layout, first creating duplicate rows or columns where there is more than one value in a cell and then merging adjacent cells on the x and/or y axes. 

The final render operation is left to the user, using the tools and techniques of your choice. The returned data structure is a jagged array with values for `cols` and `rows` denoting how many column and rows the cell spans.

These visualisations are an invaluable communication tool offering insight into the health of a portfolio.

If you like @steelbreeze/landscape, please star it.
## Installation
### NPM
To install from npm:
```
npm install @steelbreeze/landscape
```
### Web
For web via a CDN:
```javascript
import * as pivot from 'https://cdn.skypack.dev/@steelbreeze/landscape@3.2?min';
```
### Dependencies
@steelbreeze/landscape is dependant on [@steelbreeze/pivot](https://github.com/steelbreeze/pivot), also installable via npm or skypack.
The @steelbreeze/landscape API requires cubes and dimensions generated by @steelbreeze/pivot.

## Example
This simple example is taken from the [steelbreeze.net](https://steelbreeze.net) homepage:
```javascript
// create pre-defined dimensions
const axes = {
	x: ["Rates", "FX", "MM", "Credit", "Equities"].map(landscape.criteria("Product")),
	y: ["Market gateway", "Order execution", "Order management", "Confirmations"].map(landscape.criteria("Capability"))
};

// pivot the data using the product and capability dimensions as the x and y axes respectively
const cube = pivot.pivot(data, axes.y, axes.x);

// create a table of data from the pivot cube
const table = landscape.table(cube, axes, key, true);

// merge cells on both axes where possible
landscape.merge(table, true, true);

// render the table in the target element
document.getElementById('tablan').replaceWith(render.table(table, 'tablan', 'landscape'));

...

// create text and style to be used when rendering the table
function key(record) {
	return { text: record.Name, style: record.Status };
}
```
Note that while the key function must comply with the `Key` interface, specifing values for `text` and `style`, other properties can be  added and these will be available at the time of rendering. When merging adjacent cells, in the `merge` function, only `text` and `style` are compared.

## Usage
The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v3/).

## License
MIT License

Copyright (c) 2022 David Morris.
