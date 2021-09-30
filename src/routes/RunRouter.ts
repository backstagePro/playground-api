import { Router, Response, Request, NextFunction } from "express";
import ProjectRepository from "../model/repositories/ProjectRepository";
import { SERVICE_REPOSITORY_FACTORY, SERVICE_RUN_GENERATOR } from "../services";
import ServiceLocator from "../services/ServiceLocator";

let router = Router();

router.post('/run/start',  async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        let runId = req.body.runId;

        let runGenerator = await ServiceLocator.get<SERVICE_RUN_GENERATOR>(SERVICE_RUN_GENERATOR)

        await runGenerator.startRunSession(runId);
    
        res.json({});
    } catch(e){
        
        debugger;

        next(e);
    }

});

export default router;