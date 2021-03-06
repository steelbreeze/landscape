# landscape
Landscape map visualisation of data.
![landscape map viewpoint](https://steelbreeze.net/images/landscape-map.png)
These visualisations conform to the [Archimate Landscape Map Viewpoint](https://pubs.opengroup.org/architecture/archimate2-doc/chap08.html#_Toc371945248).
The tool takes as an input data set of the portfolio and dimensions they are associated with; it then can determine the optimal sequence of the values on the dimensions you select for the x and y axis for the optimal layout. It then generates the layout, splitting a cell in the table if multiple items in the portfolio are mapped to it, and joining items in neighbouring cells. 

These visualisations are an invaluable communication tool offering insight into the health of an application portfolio. High density areas indicate a fragmented portfolio, or redundancy; a wide scope may indicate over-extension.

If you like @steelbreeze/landscape, please star it.
## Installation
Download landscape.min.js from the Releases page. Once added into your project, the API will be available under the ```landscape``` global object.
## Usage
The API is split into four main functions:
1. getAxes: analyses an array of source data and returns a pair of axis (the set of distinct values for given property names).
2. getOptimalAxes: an alternative to getOptimalAxes, this function analyses the source data to return the optimal order of the axes values, where there is good adjacency across cells, resulting in the feweer boxes drawn. This uses a reduced version of brute-force approach to ensure every combination of y axis order is evaluated, then for the best ones, all x axis orders are evaluates; this therefore has O(nx! + y!) time complexity where n is source data dependant.
3. prepareData: structures the source data based on a pair of axes.
4. getTable: returns the source data in an intermediary format ready for rendering instep 5.
5. getHTML: generates an array of HTML table rows for insertion into a table or table body.

Depending on your needs, you use a subset of these functions. For example, if you know the axes you want to display, you can omit step 1; if you know the sequence you'd like the axes displayed in, omit step 2; if you wish to render your own HTML or SVG in D3 or similar, you can omit step 5.

The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v1/).

## License
MIT License

Copyright (c) 2020 David Mesquita-Morris
