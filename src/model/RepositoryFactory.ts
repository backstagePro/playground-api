import { SERVICE_MONGODB_ADAPTER } from "../services";
import ArtefactFactory from "../services/artefacts/ArtefactFactory";
import { BaseRepository } from "./base/BaseRepository";
import ArtefactRepository, { MONGO_DATABASE_ARTEFACTS } from "./repositories/ArtefactRepository";
import ProjectRepository, { MONGO_DATABASE_PROJECTS } from "./repositories/ProjectRepository";
import RunRepository, { MONGO_DATABASE_RUNS } from "./repositories/RunRepository";

export type RepositoryNames = 'project' | 'run' | 'artefact' ;

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

    if(repositoryName === 'run'){
        return new RunRepository(database, MONGO_DATABASE_RUNS);
    }

    if(repositoryName === 'artefact'){
        return new ArtefactRepository(database, MONGO_DATABASE_ARTEFACTS);
    }

    throw new Error("Missing repository " + repositoryName);
  }
}