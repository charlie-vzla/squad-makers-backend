import {
  ChuckNorrisJokeDTO,
  DadJokeDTO,
  JokeDTO,
} from '../../models/jokes/Joke.model';

export class JokesService {
  private static instance: JokesService;

  private constructor() {
  }

  public static getInstance(): JokesService {
    if (!JokesService.instance) {
      JokesService.instance = new JokesService();
    }
    return JokesService.instance;
  }

  async getRandomJoke(): Promise<JokeDTO | null> {
    return null;
  }

  async getChuckNorrisJoke(): Promise<ChuckNorrisJokeDTO> {
    throw new Error('Not implemented');
  }

  async getDadJoke(): Promise<DadJokeDTO> {
    throw new Error('Not implemented');
  }
}
