import { Request, Response } from 'express';
import MathService from '../services/MathService';

export class MathController {
  private static instance: MathController;
  private readonly service: MathService;

  private constructor() {
    this.service = MathService.getInstance();
  }

  public static getInstance(): MathController {
    if (!MathController.instance) {
      MathController.instance = new MathController();
    }
    return MathController.instance;
  }

  /**
   * Handles GET /api/math/lcm request to calculate LCM.
   * @param {Request} req - Express request object with numbers query param
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getLCM(req: Request, res: Response): Promise<void> {
    const numbersStr = req.query.numbers as string;
    const numbers = numbersStr.split(',').map(num => Number.parseInt(num.trim(), 10));

    const lcm = await this.service.calculateLCM(numbers);

    res.status(200).json({
      success: true,
      data: { lcm },
    });
  }

  /**
   * Handles GET /api/math/increment request to increment a number.
   * @param {Request} req - Express request object with number query param
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  async getIncrement(req: Request, res: Response): Promise<void> {
    const number = Number.parseInt(req.query.number as string, 10);

    const result = await this.service.incrementNumber(number);

    res.status(200).json({
      success: true,
      data: { result },
    });
  }
}
