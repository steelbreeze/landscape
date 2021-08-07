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
The full API documentation can be found [here](https://steelbreeze.net/landscape/api/v1/).

## License
MIT License

Copyright (c) 2020 David Mesquita-Morris
