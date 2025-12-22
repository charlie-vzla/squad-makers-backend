import { Request, Response } from 'express';

export class MathController {
  private static instance: MathController;

  private constructor() {
  }

  public static getInstance(): MathController {
    if (!MathController.instance) {
      MathController.instance = new MathController();
    }
    return MathController.instance;
  }

  async getLCM(_req: Request, res: Response): Promise<void> {
    res.status(500).json({ success: false });
  }

  async getIncrement(_req: Request, res: Response): Promise<void> {
    res.status(500).json({ success: false });
  }
}
