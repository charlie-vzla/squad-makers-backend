import elasticsearchClient from '../config/elasticsearch';
import logger from '../config/logger';

/**
 * Interface for joke documents stored in Elasticsearch
 */
export interface JokeDocument {
  text: string;
  source: string;
  userId?: string;
  userName?: string;
  topics?: string[];
  number?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing jokes in Elasticsearch.
 * Implements Singleton pattern.
 */
class ElasticsearchService {
  private static instance: ElasticsearchService;
  private readonly indexName = 'jokes';

  private constructor() {}

  /**
   * Gets the singleton instance of ElasticsearchService.
   * @returns {ElasticsearchService} The singleton instance
   */
  public static getInstance(): ElasticsearchService {
    if (!ElasticsearchService.instance) {
      ElasticsearchService.instance = new ElasticsearchService();
    }
    return ElasticsearchService.instance;
  }

  /**
   * Indexes a joke in Elasticsearch for full-text search.
   * @param {string} id - Unique identifier for the joke
   * @param {JokeDocument} joke - Joke document to index
   */
  async indexJoke(id: string, joke: JokeDocument): Promise<void> {
    try {
      await elasticsearchClient.index({
        index: this.indexName,
        id: id,
        document: joke,
      });
      logger.info(`Joke indexed in Elasticsearch: ${id}`);
    } catch (error) {
      logger.error('Failed to index joke in Elasticsearch:', error);
      throw error;
    }
  }

  /**
   * Searches jokes using full-text search with fuzzy matching.
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results (default: 10)
   * @returns {Promise<any[]>} Array of matching jokes with scores
   */
  async searchJokes(query: string, limit: number = 10): Promise<any[]> {
    try {
      const result = await elasticsearchClient.search({
        index: this.indexName,
        body: {
          query: {
            multi_match: {
              query: query,
              fields: ['text^2', 'userName', 'topics'],
              fuzziness: 'AUTO',
            },
          },
          size: limit,
          sort: [
            { _score: { order: 'desc' } },
            { createdAt: { order: 'desc' } },
          ],
        },
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      }));
    } catch (error) {
      logger.error('Failed to search jokes in Elasticsearch:', error);
      throw error;
    }
  }

  /**
   * Deletes a joke from Elasticsearch index.
   * @param {string} id - Unique identifier of the joke to delete
   */
  async deleteJoke(id: string): Promise<void> {
    try {
      await elasticsearchClient.delete({
        index: this.indexName,
        id: id,
      });
      logger.info(`Joke deleted from Elasticsearch: ${id}`);
    } catch (error) {
      logger.error('Failed to delete joke from Elasticsearch:', error);
      throw error;
    }
  }
}

export default ElasticsearchService;
