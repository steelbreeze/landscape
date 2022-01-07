"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leastCommonMultiple = void 0;
/**
 * Returns the least common multiple of a set of integers generated from an object.
 * @hidden
 */
const leastCommonMultiple = (...counts) => counts.reduce((a, b) => (a * b) / greatestCommonFactor(a, b));
exports.leastCommonMultiple = leastCommonMultiple;
/**
 * Returns the greatest common factor of two numbers
 * @hidden
 */
const greatestCommonFactor = (a, b) => b ? greatestCommonFactor(b, a % b) : a;
