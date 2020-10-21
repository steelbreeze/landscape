"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flexOrder = exports.getOptimalAxes = void 0;
/**
 * Determine the a good order of the axes resulting in a layout with applications grouped together.
 * @param source The sourlce data to analyse when determining the optimal axes.
 * @param x The chosen x axis.
 * @param y The chosen y axis.
 * @param getKey A callback to create a unique key for the reduction of applications into the cells.
 * @param axesSelector A function
 * @param yF The algorithm to use the generate scenarios to test on the y axis; defaults to all permutations.
 * @param xF The algorithm to use the generate scenarios to test on the x axis; defaults to all permutations.
 * @returns Returns all conbinations of x and y axes with the greatest grouping of applications
 */
function getOptimalAxes(source, x, y, getKey, axesSelector = scenarios => scenarios[0], xF = flexOrder, yF = flexOrder) {
    const isXLong = x.values.length > y.values.length;
    const shortAxis = isXLong ? y : x;
    const longAxis = isXLong ? x : y;
    let interimScenarios = [];
    let scenarios = [];
    let bestAdjacency = -1;
    // denormalise the data
    const interim = [];
    for (const app of source) {
        const key = getKey(app);
        const use = { l: app[longAxis.name], s: app[shortAxis.name] };
        const resApp = interim.find(da => da.key.text === key.text && da.key.style === key.style);
        if (resApp) {
            resApp.usage.push(use);
        }
        else {
            interim.push({ key, usage: [use] });
        }
    }
    const denormalised = interim.filter(app => app.usage.length > 1);
    // iterate permutations of the long axis, use the short axis as provided
    for (const longAxisValues of (isXLong ? xF : yF)(longAxis)) {
        // count only adjacency along the long axis
        let adjacency = 0;
        // TODO: investigate the creation of a bitmask representing the apps, thereby only performing the calculations below once
        // test each combination individually
        for (const app of denormalised) {
            // create 2d boolean matrix where the application exists 
            const matrix = longAxisValues.map(l => shortAxis.values.map(s => app.usage.some(use => use.l === l && use.s === s)));
            for (let iL = longAxisValues.length; --iL;)
                for (let iS = shortAxis.values.length; iS--;) {
                    if (matrix[iL][iS] && matrix[iL - 1][iS]) {
                        adjacency++;
                    }
                }
        }
        // just keep the best scenarios
        if (adjacency >= bestAdjacency) {
            // reset the best if needed
            if (adjacency > bestAdjacency) {
                interimScenarios = [];
                bestAdjacency = adjacency;
            }
            interimScenarios.push(longAxisValues);
        }
    }
    // reset the best adjacency
    bestAdjacency = -1;
    // iterate just the best long axis results and iterate permutations of the short axis
    for (const longAxisValues of interimScenarios)
        for (const shortAxisValues of (isXLong ? yF : xF)(shortAxis)) {
            // count only adjacency alony the short axis
            let adjacency = 0;
            // test each application/status combination individually
            for (const app of denormalised) {
                // create 2d boolean matrix where the application exists 
                const matrix = longAxisValues.map(l => shortAxisValues.map(s => app.usage.some(use => use.l === l && use.s === s)));
                // count adjacent cells on the x axis
                for (let iL = longAxisValues.length; iL--;)
                    for (let iS = shortAxisValues.length; --iS;) {
                        if (matrix[iL][iS] && matrix[iL][iS - 1]) {
                            adjacency++;
                        }
                    }
            }
            // just keep the best scenarios
            if (adjacency >= bestAdjacency) {
                // reset the best if needed
                if (adjacency > bestAdjacency) {
                    scenarios = [];
                    bestAdjacency = adjacency;
                }
                scenarios.push(isXLong ? { y: { name: shortAxis.name, values: shortAxisValues }, x: { name: longAxis.name, values: longAxisValues } } : { x: { name: shortAxis.name, values: shortAxisValues }, y: { name: longAxis.name, values: longAxisValues } });
            }
        }
    //	console.log(scenarios);
    return axesSelector(scenarios);
}
exports.getOptimalAxes = getOptimalAxes;
/**
 * Allow an axis to be assessed in any order of the axis values.
 * @param axis The axis to flex
 * @hidden
 */
function flexOrder(axis) {
    return permutations(axis.values);
}
exports.flexOrder = flexOrder;
/**
 * Returns all possible orderings of an array
 * @hidden
 */
function permutations(source) {
    let result = [];
    if (source.length === 1) {
        result = [source];
    }
    else {
        source.forEach(exclude => {
            for (const excluded of permutations(source.filter(element => element !== exclude))) {
                result.push([exclude, ...excluded]);
            }
        });
    }
    return result;
}
