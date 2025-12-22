import { JokeWithRelations } from '../../models/jokes/Joke.model';

export class JokesRepository {
  private static instance: JokesRepository;

  private constructor() {
    // Private constructor for Singleton
  }

  public static getInstance(): JokesRepository {
    if (!JokesRepository.instance) {
      JokesRepository.instance = new JokesRepository();
    }
    return JokesRepository.instance;
  }

  async getRandomJoke(): Promise<JokeWithRelations | null> {
    // TODO: Implement
    return null;
  }
}
