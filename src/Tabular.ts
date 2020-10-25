// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris
import { Dictionary } from './Dictionary';

/** Tabluar data; an array of dictionaries */
export type Tabular<TValue = unknown> = Array<Dictionary<TValue>>;
