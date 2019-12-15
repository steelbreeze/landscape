import { Application } from './Application';
import { Axes } from './Axes';
import { flex } from './flex';

/**
 * Determine the optimum order of the axes resulting in a layout with applications grouped together
 * @param applications The raw application data
 * @param axes The x and y axes
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
export function getOptimalAxes(applications: Array<Application>, axes: Axes, yF: (axis: Array<string>) => Array<Array<string>> = flex, xF: (axis: Array<string>) => Array<Array<string>> = flex): Array<Axes> {
    let result: Array<Axes> = [];
    let bestAdjacency = -1;

    // denormalise the underlying application data and resolve the axes
    let interim: Array<{ name: string, status: string, usage: Array<{ x: string, y: string }> }> = [];

    for (const app of applications) {
        for (const use of app.usage) {
            let interimApp = interim.filter(a => a.name === app.name && a.status === use.status)[0];

            if (!interimApp) {
                interimApp = { name: app.name, status: use.status, usage: [] };

                interim.push(interimApp);
            }

            interimApp.usage.push({ x: use[axes.xDimension], y: use[axes.yDimension] });
        }
    }

    // delete single use app/status combinations as they cannot contribute to affinity score
    interim = interim.filter(app => app.usage.length > 1);

    // some items not to recalculate in an O(n!) algo
    const xPerms = xF(axes.xValues);

    // iterate all X and Y using the formulas provided
    for (const yValues of yF(axes.yValues)) {
        for (const xValues of xPerms) {
            let adjacency = 0;
            
            // test each application/status combination individually
            for (const app of interim) {
                // create 2d boolean matrix where the application exists 
                const matrix = yValues.map(y => xValues.map(x => app.usage.some(use => use.y === y && use.x === x)));

                // count adjacent cells
                for (let iY = yValues.length; iY--;) {
                    for (let iX = xValues.length; iX--;) {
                        if (matrix[iY][iX]) {
                            if (iY && matrix[iY - 1][iX]) {
                                adjacency++;
                            }

                            if (iX && matrix[iY][iX - 1]) {
                                adjacency++;
                            }
                        }
                    }
                }
            }

            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                if (adjacency > bestAdjacency) {
                    result = [];
                    bestAdjacency = adjacency;
                }

                result.push({ xDimension: axes.xDimension, xValues, yDimension: axes.yDimension, yValues });
            }
        }
    }

    return result;
}
