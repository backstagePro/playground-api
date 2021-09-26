import { Router, Request, Response, NextFunction} from 'express';
import Project from '../model/entities/Project';
import { SERVICE_ARTEFACT_FINDER, SERVICE_ARTEFACT_FINDER_PARAMS, SERVICE_REPOSITORY_FACTORY } from '../services';
import ServiceLocator from '../services/ServiceLocator';

let router = Router();

router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {

  let projectRepository = (await ServiceLocator
    .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');

  let allProjects = await (await projectRepository).listAll();

  res.json({allProjects: allProjects});
});


router.post('/project/import', async (req: Request, res: Response, next: NextFunction) => {

  let projectPath = req.body.projectPath;

  let artefactFinder = await ServiceLocator
    .get<SERVICE_ARTEFACT_FINDER, SERVICE_ARTEFACT_FINDER_PARAMS>(SERVICE_ARTEFACT_FINDER, {
    projectPath 
  });
  
  let projectRepository = (await ServiceLocator
    .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');

  // extract all artefacts from the project
  let artefacts = await artefactFinder.findAllArtefact();

  let project = new Project({ path: projectPath, artefacts });

  await (await projectRepository).create(project);

  res.json({artefacts: artefacts});
});

export default router;