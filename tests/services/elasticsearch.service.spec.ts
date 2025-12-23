import ElasticsearchService, { JokeDocument } from '../../src/services/ElasticsearchService';
import elasticsearchClient from '../../src/config/elasticsearch';

jest.mock('../../src/config/elasticsearch', () => ({
  __esModule: true,
  default: {
    index: jest.fn(),
    search: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;

  beforeEach(() => {
    service = ElasticsearchService.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance (Singleton)', () => {
      const instance1 = ElasticsearchService.getInstance();
      const instance2 = ElasticsearchService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('indexJoke', () => {
    it('should index a joke in Elasticsearch', async () => {
      const mockJoke: JokeDocument = {
        text: 'Chuck Norris can divide by zero',
        source: 'Chuck',
        userId: 'user-123',
        userName: 'Pedro',
        topics: ['humor negro'],
        number: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (elasticsearchClient.index as jest.Mock).mockResolvedValue({ result: 'created' });

      await service.indexJoke('joke-123', mockJoke);

      expect(elasticsearchClient.index).toHaveBeenCalledWith({
        index: 'jokes',
        id: 'joke-123',
        document: mockJoke,
      });
    });

    it('should throw error when indexing fails', async () => {
      const mockJoke: JokeDocument = {
        text: 'Test joke',
        source: 'Dad',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (elasticsearchClient.index as jest.Mock).mockRejectedValue(new Error('ES Error'));

      await expect(service.indexJoke('joke-123', mockJoke)).rejects.toThrow('ES Error');
    });
  });

  describe('searchJokes', () => {
    it('should search jokes and return results', async () => {
      const mockSearchResult = {
        hits: {
          hits: [
            {
              _id: 'joke-1',
              _score: 1.5,
              _source: {
                text: 'Chuck Norris joke',
                source: 'Chuck',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
            {
              _id: 'joke-2',
              _score: 1.2,
              _source: {
                text: 'Dad joke',
                source: 'Dad',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        },
      };

      (elasticsearchClient.search as jest.Mock).mockResolvedValue(mockSearchResult);

      const results = await service.searchJokes('Chuck Norris', 10);

      expect(elasticsearchClient.search).toHaveBeenCalledWith({
        index: 'jokes',
        body: {
          query: {
            multi_match: {
              query: 'Chuck Norris',
              fields: ['text^2', 'userName', 'topics'],
              fuzziness: 'AUTO',
            },
          },
          size: 10,
          sort: [
            { _score: { order: 'desc' } },
            { createdAt: { order: 'desc' } },
          ],
        },
      });

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('joke-1');
      expect(results[0].score).toBe(1.5);
      expect(results[0].text).toBe('Chuck Norris joke');
    });

    it('should use default limit of 10 when not specified', async () => {
      const mockSearchResult = {
        hits: {
          hits: [],
        },
      };

      (elasticsearchClient.search as jest.Mock).mockResolvedValue(mockSearchResult);

      await service.searchJokes('test');

      expect(elasticsearchClient.search).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            size: 10,
          }),
        })
      );
    });

    it('should throw error when search fails', async () => {
      (elasticsearchClient.search as jest.Mock).mockRejectedValue(new Error('Search failed'));

      await expect(service.searchJokes('test')).rejects.toThrow('Search failed');
    });
  });

  describe('deleteJoke', () => {
    it('should delete a joke from Elasticsearch', async () => {
      (elasticsearchClient.delete as jest.Mock).mockResolvedValue({ result: 'deleted' });

      await service.deleteJoke('joke-123');

      expect(elasticsearchClient.delete).toHaveBeenCalledWith({
        index: 'jokes',
        id: 'joke-123',
      });
    });

    it('should throw error when deletion fails', async () => {
      (elasticsearchClient.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await expect(service.deleteJoke('joke-123')).rejects.toThrow('Delete failed');
    });
  });
});
