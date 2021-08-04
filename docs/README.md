# Outline control flow for example
## Create cube
### Triggers
- New data loaded
- Axis selection changed

Process overview
0. Load the data
1. Any optional filtering of the source (exclusions)
2. Determine the axes
3. Create the pivot cube
4. Filter the cube
5. Split multi-cells on x or y axis
6. Project the final table
7. Merge adjacent cells on x | y | xy | xy | none axes
8. Render


OLD-------------------

# Process
## Create the cube
1. Create the x and y axes
2. Create a pivot cube with all data based on selected axes

## Expand the cube and axes
Convert each row or column with multiple values in a cell into multiple rows or columns
### Triggers
1. Cube creation

## Query the cube
### Triggers
- Cube expanded
- Date of interest changed
- Fact of interest changed
### Process
1. Query cube for items active on that date, returning the facts derived from the data

## Render
### Triggers
- Query returned
- Split/merge options changed

### Process
1. Add the axes to the query result forming a table
2. Split and merge table cells
3. Render result as HTML