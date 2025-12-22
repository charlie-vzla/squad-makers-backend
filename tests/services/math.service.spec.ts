import MathService from '../../src/services/MathService';

describe('MathService', () => {
  let service: MathService;

  beforeEach(() => {
    (MathService as any).instance = undefined;
    service = MathService.getInstance();
  });

  describe('calculateLCM', () => {
    it('should calculate LCM of two numbers', async () => {
      const result = await service.calculateLCM([4, 6]);
      expect(result).toBe(12);
    });

    it('should calculate LCM of multiple numbers', async () => {
      const result = await service.calculateLCM([12, 15, 20]);
      expect(result).toBe(60);
    });

    it('should return the number itself for single number', async () => {
      const result = await service.calculateLCM([42]);
      expect(result).toBe(42);
    });

    it('should throw error for empty array', async () => {
      await expect(service.calculateLCM([])).rejects.toThrow('Numbers array cannot be empty');
    });
  });

  describe('incrementNumber', () => {
    it('should increment a positive number by 1', async () => {
      const result = await service.incrementNumber(5);
      expect(result).toBe(6);
    });

    it('should increment zero to 1', async () => {
      const result = await service.incrementNumber(0);
      expect(result).toBe(1);
    });

    it('should increment a negative number by 1', async () => {
      const result = await service.incrementNumber(-10);
      expect(result).toBe(-9);
    });

    it('should increment large numbers', async () => {
      const result = await service.incrementNumber(999999);
      expect(result).toBe(1000000);
    });

    it('should throw error when number would exceed safe integer range', async () => {
      await expect(service.incrementNumber(Number.MAX_SAFE_INTEGER)).rejects.toThrow(
        'Number would exceed safe integer range'
      );
    });
  });
});
