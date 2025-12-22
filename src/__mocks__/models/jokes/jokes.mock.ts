import { JokeDTO, ChuckNorrisJokeDTO, DadJokeDTO } from '../../../models/jokes/Joke.model';

export const mockJokeDTO: JokeDTO = {
  id: '123',
  text: 'This is a random joke from DB',
  source: 'custom',
  number: 1,
  user: {
    id: 'user1',
    name: 'Manolito',
  },
  topics: ['humor negro'],
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockChuckNorrisJoke: ChuckNorrisJokeDTO = {
  id: 'chuck123',
  text: 'Chuck Norris counted to infinity. Twice.',
  source: 'Chuck',
  url: 'https://api.chucknorris.io/jokes/chuck123',
};

export const mockDadJoke: DadJokeDTO = {
  id: 'dad123',
  text: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
  source: 'Dad',
};

export const mockChuckNorrisApiResponse = {
  id: 'chuck123',
  value: 'Chuck Norris counted to infinity. Twice.',
  url: 'https://api.chucknorris.io/jokes/chuck123',
};

export const mockDadJokeApiResponse = {
  id: 'dad123',
  joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
};
