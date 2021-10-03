import RepositoryFactory from "./model/RepositoryFactory";
import ServiceLocator from "./services/ServiceLocator";
import ArtefactFactory from "./services/artefacts/ArtefactFactory";
import ArtefactFinder from "./services/artefacts/ArtefactFinder";
import MongoDbAdapter from "./services/db/MongoDbAdapter";
import DirectoryManager from "./services/directory/DirectoryManager";
import ProjectLoader from "./services/ProjectLoader";
import TransformerFactory from "./services/ts-compiler/TransformerFactory";
import IdGenerator from "./services/IdGenerator";
import RunGenerator from "./services/run/RunGenerator";
import ShellService from "./services/ShellService";
import RunServer from "./services/run-service/RunServer";
import WebsocketServer from "./services/ws/WebsocketServer";

/**
 * Service used for loading the project into the system.
 * 
 * Here is the moment, where if metadata folder is missing, will be created.
 */
export let SERVICE_PROJECT_LOADER: 'SERVICE_PROJECT_LOADER' = 'SERVICE_PROJECT_LOADER';
export type SERVICE_PROJECT_LOADER = ProjectLoader;

ServiceLocator.set(SERVICE_PROJECT_LOADER, async () => {
    
    return new ProjectLoader();

});


 /**
 * Service used for loading the project into the system.
 * 
 * Here is the moment, where if metadata folder is missing, will be created.
 */
export let SERVICE_METADATA_CREATOR: 'SERVICE_METADATA_CREATOR' = 'SERVICE_METADATA_CREATOR';
export type SERVICE_METADATA_CREATOR = ProjectLoader;

ServiceLocator.set(SERVICE_METADATA_CREATOR, async () => {
    
    return new ProjectLoader();

});

/**
 * Abstraction on top of directory.
 * 
 * If given directory doesn't exist, it will be created.
 * 
 */
export let SERVICE_DIRECTORY: 'SERVICE_DIRECTORY' = 'SERVICE_DIRECTORY';
export type SERVICE_DIRECTORY = DirectoryManager;


ServiceLocator.set(SERVICE_DIRECTORY, async () => {
    
    return new DirectoryManager();
});

/**
 * Mongodb Adapter
 * 
 */
export let SERVICE_MONGODB_ADAPTER: 'SERVICE_MONGODB_ADAPTER' = 'SERVICE_MONGODB_ADAPTER';
export type SERVICE_MONGODB_ADAPTER = MongoDbAdapter;


ServiceLocator.set(SERVICE_MONGODB_ADAPTER, async () => {
    
    return new MongoDbAdapter();
});


/**
 * Used to get entity repository 
 *
 */
export let SERVICE_REPOSITORY_FACTORY: 'SERVICE_REPOSITORY_FACTORY' = 'SERVICE_REPOSITORY_FACTORY';
export type SERVICE_REPOSITORY_FACTORY = RepositoryFactory;


ServiceLocator.set(SERVICE_REPOSITORY_FACTORY, async () => {
    
    return new RepositoryFactory( 
        (await ServiceLocator.get<SERVICE_MONGODB_ADAPTER, any>(SERVICE_MONGODB_ADAPTER, null)) 
    );
});


/**
 * Used to collect all artefacts from given project 
 *
 */
export let SERVICE_ARTEFACT_FINDER: 'SERVICE_ARTEFACT_FINDER' = 'SERVICE_ARTEFACT_FINDER';
export type SERVICE_ARTEFACT_FINDER = ArtefactFinder;
export type SERVICE_ARTEFACT_FINDER_PARAMS = {
    projectPath: string;
}


ServiceLocator.set(SERVICE_ARTEFACT_FINDER, async (params: SERVICE_ARTEFACT_FINDER_PARAMS) => {

    let directoryProvider = await ServiceLocator
        .get<SERVICE_DIRECTORY, any>(SERVICE_DIRECTORY, null);


    let directory = await directoryProvider.getDirectory(params.projectPath)
    
    return new ArtefactFinder(
        directory,
        (await ServiceLocator.get<SERVICE_ARTEFACT_FACTORY, any>(SERVICE_ARTEFACT_FACTORY, null))
    );
    
}, {singleton: false});

/**
 * Used to create artefacts 
 *
 */
export let SERVICE_ARTEFACT_FACTORY: 'SERVICE_ARTEFACT_FACTORY' = 'SERVICE_ARTEFACT_FACTORY';
export type SERVICE_ARTEFACT_FACTORY = ArtefactFactory;

ServiceLocator.set(SERVICE_ARTEFACT_FACTORY, async () => {
    
    return new ArtefactFactory(
        (await ServiceLocator.get<SERVICE_ID_GENERATOR>(SERVICE_ID_GENERATOR))
    );
});


/**
 * Used to for AST Analysis
 *
 */
export let SERVICE_TRANSFORMER_FACTORY: 'SERVICE_TRANSFORMER_FACTORY' = 'SERVICE_TRANSFORMER_FACTORY';
export type SERVICE_TRANSFORMER_FACTORY = TransformerFactory;

ServiceLocator.set(SERVICE_TRANSFORMER_FACTORY, async () => {
    
    return new TransformerFactory();
});

/**
 * Generator of ids 
 *
 */
export let SERVICE_ID_GENERATOR: 'SERVICE_ID_GENERATOR' = 'SERVICE_ID_GENERATOR';
export type SERVICE_ID_GENERATOR = IdGenerator;

ServiceLocator.set(SERVICE_ID_GENERATOR, async () => {
    
    return new IdGenerator();
});


/**
 * Creates run session 
 *
 */
export let SERVICE_RUN_GENERATOR: 'SERVICE_RUN_GENERATOR' = 'SERVICE_RUN_GENERATOR';
export type SERVICE_RUN_GENERATOR = RunGenerator;

ServiceLocator.set(SERVICE_RUN_GENERATOR, async () => {
    
    return new RunGenerator(
        (await ServiceLocator.get<SERVICE_TRANSFORMER_FACTORY>(SERVICE_TRANSFORMER_FACTORY)),
        (await ServiceLocator.get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY))
    );
});


/**
 * Run shell command 
 *
 */
export let SERVICE_SHELL: 'SERVICE_SHELL' = 'SERVICE_SHELL';
export type SERVICE_SHELL = ShellService;
export type SERVICE_SHELL_PARAMS = {
    command: string;
}

ServiceLocator.set(SERVICE_SHELL, async (params: SERVICE_SHELL_PARAMS) => {
    
    return new ShellService(params.command);
}, { singleton: false });

/**
 * Used to generate a servers for the runs 
 *
 */
export let SERVICE_RUN_SERVER: 'SERVICE_RUN_SERVER' = 'SERVICE_RUN_SERVER';
export type SERVICE_RUN_SERVER = RunServer;

ServiceLocator.set(SERVICE_RUN_SERVER, async () => {
    
    return new RunServer();
});

/**
 * Creates a websocket server 
 *
 */
export let SERVICE_WEBSOCKET_SERVER: 'SERVICE_WEBSOCKET_SERVER' = 'SERVICE_WEBSOCKET_SERVER';
export type SERVICE_WEBSOCKET_SERVER = WebsocketServer;

ServiceLocator.set(SERVICE_WEBSOCKET_SERVER, async () => {
    
    return new WebsocketServer();
});


