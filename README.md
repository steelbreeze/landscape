# landscape
Landscape map visualisation of data.
## Installation
Download landscape.min.js from the Releases page.
## Usage
The API is split into four main functions:
1. getAxes: analyses an array of application data and returns a pair of axis (the set of distinct values for given property names).
2. getOptimalAxes: analyses the application data to return the optimal order of the axes values, where there is greatest adjacency of application across cells.
3. getTable: returns the application data in an intermediary format ready for rendering in #4 or some other method, such as D3.
4. getHTML: generates an array of HTML table rows for insertion into a table or table body.

Depending on your needs, you use a subset of these functions. For example, if you know the axes you want to display and their order, you can omit steps 1 and 2.

The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v1/globals.html).

## License
MIT License

Copyright (c) 2014-9 David Mesquita-Morris
