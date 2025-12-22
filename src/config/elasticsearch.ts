import { Client } from '@elastic/elasticsearch';
import logger from './logger';

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

const elasticsearchClient = new Client({
  node: ELASTICSEARCH_URL,
});

export default elasticsearchClient;

export const connectElasticsearch = async (): Promise<void> => {
  try {
    const health = await elasticsearchClient.cluster.health({});
    logger.info('✓ Elasticsearch connected successfully', {
      cluster: health.cluster_name,
      status: health.status,
    });
  } catch (error) {
    logger.error('✗ Elasticsearch connection failed:', error);
    throw error;
  }
};

export const checkElasticsearchHealth = async (): Promise<boolean> => {
  try {
    const health = await elasticsearchClient.cluster.health({});
    return health.status !== 'red';
  } catch (error) {
    return false;
  }
};

// Initialize jokes index if it doesn't exist
export const initializeJokesIndex = async (): Promise<void> => {
  const indexName = 'jokes';
  try {
    const exists = await elasticsearchClient.indices.exists({ index: indexName });
    if (!exists) {
      await elasticsearchClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              text: { type: 'text', analyzer: 'standard' },
              source: { type: 'keyword' },
              userId: { type: 'keyword' },
              userName: { type: 'keyword' },
              topics: { type: 'keyword' },
              number: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });
      logger.info(`✓ Elasticsearch index '${indexName}' created`);
    } else {
      logger.info(`✓ Elasticsearch index '${indexName}' already exists`);
    }
  } catch (error) {
    logger.error('✗ Failed to initialize Elasticsearch index:', error);
    throw error;
  }
};
