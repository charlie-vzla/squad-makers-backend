import { Request, Response } from 'express';
import { MathController } from '../../src/controllers/MathController';

const mockCalculateLCM = jest.fn();
const mockIncrementNumber = jest.fn();

jest.mock('../../src/services/MathService', () => ({
  getInstance: () => ({
    calculateLCM: mockCalculateLCM,
    incrementNumber: mockIncrementNumber,
  }),
}));

describe('MathController', () => {
  let controller: MathController;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    (MathController as any).instance = undefined;
    controller = MathController.getInstance();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('getLCM', () => {
    it('should calculate LCM for two numbers', async () => {
      const mockRequest = {
        query: { numbers: '4,6' },
      } as unknown as Request;

      mockCalculateLCM.mockResolvedValueOnce(12);

      await controller.getLCM(mockRequest, mockResponse as Response);

      expect(mockCalculateLCM).toHaveBeenCalledWith([4, 6]);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { lcm: 12 },
      });
    });

    it('should throw error when service fails', async () => {
      const mockRequest = {
        query: { numbers: '10,20' },
      } as unknown as Request;

      mockCalculateLCM.mockRejectedValueOnce(new Error('Calculation error'));

      await expect(controller.getLCM(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Calculation error'
      );
    });
  });

  describe('getIncrement', () => {
    it('should increment a number by 1', async () => {
      const mockRequest = {
        query: { number: '5' },
      } as unknown as Request;

      mockIncrementNumber.mockResolvedValueOnce(6);

      await controller.getIncrement(mockRequest, mockResponse as Response);

      expect(mockIncrementNumber).toHaveBeenCalledWith(5);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { result: 6 },
      });
    });

    it('should increment zero to 1', async () => {
      const mockRequest = {
        query: { number: '0' },
      } as unknown as Request;

      mockIncrementNumber.mockResolvedValueOnce(1);

      await controller.getIncrement(mockRequest, mockResponse as Response);

      expect(mockIncrementNumber).toHaveBeenCalledWith(0);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { result: 1 },
      });
    });

    it('should increment negative number', async () => {
      const mockRequest = {
        query: { number: '-10' },
      } as unknown as Request;

      mockIncrementNumber.mockResolvedValueOnce(-9);

      await controller.getIncrement(mockRequest, mockResponse as Response);

      expect(mockIncrementNumber).toHaveBeenCalledWith(-10);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: { result: -9 },
      });
    });

    it('should throw error when service fails', async () => {
      const mockRequest = {
        query: { number: '42' },
      } as unknown as Request;

      mockIncrementNumber.mockRejectedValueOnce(new Error('Service error'));

      await expect(controller.getIncrement(mockRequest, mockResponse as Response)).rejects.toThrow(
        'Service error'
      );
    });
  });
});
