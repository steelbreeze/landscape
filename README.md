# landscape
Landscape map visualisation of data.


## Source data format
The landscape library works with source data in the following format:
```javascript
[
  {
    detail: {
      id: string,
      name: string
    },
    usage: [
      {
        capability: string,
        product: string,
        location: string,
        status: string,
        commissioned?: date,
        decommissioned?: date
      }
    ]
  }
]
```

## API
getAxis: returns the distinct set of values within the data for the specified dimension (taken from all the usage data in the data set.

getOptimalAxes: returns the optimal order of the values on the x and y axis.

getTable: returns a table (two dimensional array) of the detail data in accordance to the passed axes. Cells in the table will be split if there are multiple items in the cell, and merged if the same item is in adjacent cells.

getHTML: generates HTML elements as a string for insertion into a ```tbody``` element.
