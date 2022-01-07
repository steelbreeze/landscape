/**
 * Returns the least common multiple of a set of integers generated from an object. 
 * @hidden
 */
 export const leastCommonMultiple = (...counts: Array<number>): number => counts.reduce((a, b) => (a * b) / greatestCommonFactor(a, b));

 /**
  * Returns the greatest common factor of two numbers
  * @hidden
  */
 const greatestCommonFactor = (a: number, b: number): number => b ? greatestCommonFactor(b, a % b) : a;
 