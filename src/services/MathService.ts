import logger from '../config/logger';

export default class MathService {
  private static instance: MathService;

  private constructor() {}

  public static getInstance(): MathService {
    if (!MathService.instance) {
      MathService.instance = new MathService();
    }
    return MathService.instance;
  }

  /**
   * Calculates the Greatest Common Divisor of two numbers using Euclidean algorithm.
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} The GCD of a and b
   */
  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  /**
   * Calculates the Least Common Multiple of two numbers.
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} The LCM of a and b
   */
  private lcm(a: number, b: number): number {
    return (a / this.gcd(a, b)) * b;
  }

  /**
   * Calculates the Least Common Multiple of an array of numbers.
   * @param {number[]} numbers - Array of integers
   * @returns {Promise<number>} The LCM of all numbers
   * @throws {Error} If array is empty
   */
  async calculateLCM(numbers: number[]): Promise<number> {
    try {
      if (numbers.length === 0) {
        throw new Error('Numbers array cannot be empty');
      }

      return numbers.reduce((acc, num) => this.lcm(acc, num), numbers[0]);
    } catch (error) {
      logger.error('Error calculating LCM:', error);
      throw error;
    }
  }

  /**
   * Increments a number by 1.
   * @param {number} number - The number to increment
   * @returns {Promise<number>} The number incremented by 1
   * @throws {Error} If number would overflow safe integer range
   */
  async incrementNumber(number: number): Promise<number> {
    try {
      if (number >= Number.MAX_SAFE_INTEGER) {
        throw new Error('Number would exceed safe integer range');
      }

      return number + 1;
    } catch (error) {
      logger.error('Error incrementing number:', error);
      throw error;
    }
  }
}
