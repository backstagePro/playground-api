import { Router, Response, Request, NextFunction } from "express";
import { SERVICE_RUN_GENERATOR } from "../services";
import ServiceLocator from "../services/ServiceLocator";

let router = Router();

router.post('/run/start',  async (req: Request, res: Response, next: NextFunction) => {

    try {
        
        let runId = req.body.runId;

        let runGenerator = await ServiceLocator.get<SERVICE_RUN_GENERATOR>(SERVICE_RUN_GENERATOR)

        let fileMap = await runGenerator.startRunSession(runId);

        res.json({ fileMap: fileMap });

    } catch(e){

        next(e);
    }

});

export default router;