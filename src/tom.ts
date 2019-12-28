import { Application } from './Application';
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

export function tom(applications: Array<Application>, axes: Axes): Array<Axes> {
    const isXAxisLonger = axes.x.values.length >= axes.y.values.length;
    const longAxis = isXAxisLonger ? axes.x.values : axes.y.values;
    const shortAxis = isXAxisLonger ? axes.y.values : axes.x.values;

    for(const pair of pairs(shortAxis.length)) {
        console.log(`${shortAxis[pair[0]]} / ${shortAxis[pair[1]]}`);
    }

    return [axes];
}