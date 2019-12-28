import { Application } from './Application';
import { Axis } from './Axis';
import { Axes } from './Axes';

function pairs(value: number): Array<Array<number>> {
    const result: Array<Array<number>> = [];

    for (let i = value; --i;) {
        for (let j = i; j--;) {
            result.push([i,j]);
        }
    }

    return result;
}

export function tom(applications: Array<Application>, x: Axis, y: Axis): Array<Axes> {
    const isXAxisLonger = x.values.length >= y.values.length;
    const longAxis = isXAxisLonger ? x.values : y.values;
    const shortAxis = isXAxisLonger ? y.values : x.values;

    for(const pair of pairs(shortAxis.length)) {
        console.log(`${shortAxis[pair[0]]} / ${shortAxis[pair[1]]}`);
    }

    return [{x, y}];
}