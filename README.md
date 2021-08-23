# landscape
[![Maintainability](https://api.codeclimate.com/v1/badges/1106fd03a5f0df4cf80f/maintainability)](https://codeclimate.com/github/steelbreeze/landscape/maintainability)

Landscape map visualisation of data.

![landscape map viewpoint](https://steelbreeze.net/landscape/images/landscape-map.png)

This library produces visualisations of data that conform to the [Archimate Landscape Map Viewpoint](https://pubs.opengroup.org/architecture/archimate2-doc/chap08.html#_Toc371945248).

The tool takes as an input a cube of data generated by [@steelbreeze/pivot](https://github.com/steelbreeze/pivot) along with the dimensions used for the axes. It generates the layout, first creating duplicate rows or columns where there is more than one value in a cell and then merging adjacent cells on the x and/or y axes. 

The final render operation is left to the user, using the tools and techniques of your choice. The returned data structure is a jagged array with suggested `colSpan` and `rowSpan` values for rendering HTML tables.

These visualisations are an invaluable communication tool offering insight into the health of a portfolio.

If you like @steelbreeze/landscape, please star it.
## Installation
To install from npm:
```
npm install @steelbreeze/landscape
```
### Dependencies
@steelbreeze/landscape is dependant on [@steelbreeze/pivot](https://github.com/steelbreeze/pivot), also installable via npm:
```
npm install @steelbreeze/pivot
```
The @steelbreeze/landscape API requires cubes and dimensions generated by @steelbreeze/pivot.

## Example
This simple example is taken from the [steelbreeze.net](https://steelbreeze.net) homepage:
```javascript
// create pre-defined dimensions
const product = pivot.dimension(["Rates", "FX", "MM", "Credit", "Equities"], "Product");
const capability = pivot.dimension(["Market gateway", "Order execution", "Order management", "Confirmations"], "Capability");

// pivot the data using the product and capability dimensions as the x and y axes respectively
const cube = pivot.cube(data, product, capability);

// create a table of data from the pivot cube and dimensions
const table = landscape.table(cube, product, capability, key, true);

// merge cells on both axes where possible
landscape.merge(table, true, true);

// render the table in a designated element
renderTable(table, 'landscapeTarget');
```

## Usage
The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v3/).

## License
MIT License

Copyright (c) 2020-21 David Mesquita-Morris.
