// @steelbreeze/landscape
// Copyright (c) 2019 David Mesquita-Morris

/** An object whose properties are keyed by string and having a common type. */
export type Dictionary<TValue = unknown> = { [key: string]: TValue };
