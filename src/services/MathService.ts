export default class MathService {
  private static instance: MathService;

  private constructor() {}

  public static getInstance(): MathService {
    if (!MathService.instance) {
      MathService.instance = new MathService();
    }
    return MathService.instance;
  }

  async calculateLCM(_numbers: number[]): Promise<number> {
    return 0;
  }

  async incrementNumber(_number: number): Promise<number> {
    return 0;
  }
}
