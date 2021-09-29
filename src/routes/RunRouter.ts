import { Router, Response, Request, NextFunction } from "express";
import ProjectRepository from "../model/repositories/ProjectRepository";
import { SERVICE_REPOSITORY_FACTORY } from "../services";
import ServiceLocator from "../services/ServiceLocator";

let router = Router();

router.post('/run/start',  async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        let runId = req.body.runId;
    
        // get project repository
        let projectRepository = (await ServiceLocator
            .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');
    
        // find the run
        // let projectDoc = await (await projectRepository as ProjectRepository).findRun( runId );
    
        // if(!projectDoc){
        //     return next(new Error("Cannot find run with id " + runId));
        // }
    
        // get full path to artefact ...
    
        // run file cloner (change ast, add logs)
        // - get all imports 
        // - clone all files ;
    
        // start server ... ts-node-dev ... (shell command)
    
        // return to client ->
    
        // client start listening websocket to the new app
    
        // new app send the data to client 
    
        // start watch for file change...
    
        // when change -> ast only to that file ... , update only the file... 
    
        
    
    
        debugger;
    
        res.json({});
    } catch(e){
        
        debugger;

        next(new Error(e));
    }

});

export default router;