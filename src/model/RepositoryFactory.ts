import { SERVICE_MONGODB_ADAPTER } from "../services";
import { BaseRepository } from "./base/BaseRepository";
import ProjectRepository, { MONGO_DATABASE_PROJECTS } from "./repositories/ProjectRepository";

export type RepositoryNames = 'project';

export default class RepositoryFactory {

  private MongoDbAdapter: SERVICE_MONGODB_ADAPTER;

  constructor(MongoDbAdapter: SERVICE_MONGODB_ADAPTER){

    this.MongoDbAdapter = MongoDbAdapter;
  }

  async getRepository(repositoryName: RepositoryNames): Promise<BaseRepository<any>> {

    let database = await this.MongoDbAdapter.connect();

    if(repositoryName === 'project'){
      return new ProjectRepository(database, MONGO_DATABASE_PROJECTS);
    }

    throw new Error("Missing repository " + repositoryName);
  }
}