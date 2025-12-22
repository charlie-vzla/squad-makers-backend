import { Joke as PrismaJoke, User as PrismaUser, Topic as PrismaTopic } from '@prisma/client';

// DTO for API responses
export interface JokeDTO {
  id: string;
  text: string;
  source?: string;
  number: number;
  user?: UserDTO;
  topics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  id: string;
  name: string;
}

// External API response types
export interface ChuckNorrisJokeDTO {
  id: string;
  text: string;
  source: string;
  url: string;
}

export interface DadJokeDTO {
  id: string;
  text: string;
  source: string;
}

// Prisma types with relations
export type JokeWithRelations = PrismaJoke & {
  user: PrismaUser;
  jokeTopics: Array<{
    topic: PrismaTopic;
  }>;
};

// Transformation functions
export class JokeMapper {
  static toDTO(joke: JokeWithRelations): JokeDTO {
    return {
      id: joke.id,
      text: joke.text,
      source: joke.source || undefined,
      number: joke.number,
      user: {
        id: joke.user.id,
        name: joke.user.name,
      },
      topics: joke.jokeTopics.map((jt) => jt.topic.name),
      createdAt: joke.createdAt,
      updatedAt: joke.updatedAt,
    };
  }

  static chuckNorrisToDTO(apiResponse: {
    id: string;
    value: string;
    url: string;
  }): ChuckNorrisJokeDTO {
    return {
      id: apiResponse.id,
      text: apiResponse.value,
      source: 'Chuck',
      url: apiResponse.url,
    };
  }

  static dadJokeToDTO(apiResponse: { id: string; joke: string }): DadJokeDTO {
    return {
      id: apiResponse.id,
      text: apiResponse.joke,
      source: 'Dad',
    };
  }
}
