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
  });
});
