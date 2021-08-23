# 3.1
This release warants a minor version increment as is changes a minor part of the public API.

## Breaking changes
`Key.className` has been renamed `Key.style`; this impacts the callback passed into the `table` function. 

`Cell.rowSpan` has been renamed `Cell.rows`; this impacts the method used to render tables.

`Cell.colSpan` has been renamed `Cell.cols`; this impacts the method used to render tables.

# 3.0
This release is a complete rewrite to use a cube and pair of dimensions produced by the [@steebreeze/pivot library](https://github.com/steelbreeze/pivot) as a basis for generating the landscape map. This has radically reduced the size of the library and increased its performance. By splitting in two, other capabilities are exposed, such as creating numerical aggregates from the same pivot cube that the landscape visualisation uses.

## Breaking changes

The API had radically changed; please see the [@steebreeze/pivot documentation](https://steelbreeze.net/pivot/api/v1/) and  [@steebreeze/landscape documentation](https://steelbreeze.net/landscape/api/v3/).

The ability to optimise axes has been removed due to its O(n!) algorithm.

# <del>2.0</del>
There was no release 2.0. For a short time there was a release candidate as a general overhaul of the 1.0 code, but this was quickly overriden by the release 3.0.

# 1.0
The origional version of the library.