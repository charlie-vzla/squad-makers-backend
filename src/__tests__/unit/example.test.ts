// Example unit test to verify Jest configuration
describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve(42);
    await expect(promise).resolves.toBe(42);
  });
});
