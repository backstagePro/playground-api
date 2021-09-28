import { Router, Request, Response, NextFunction} from 'express';
import Project from '../model/entities/Project';
import { SERVICE_ARTEFACT_FINDER, SERVICE_ARTEFACT_FINDER_PARAMS, SERVICE_REPOSITORY_FACTORY } from '../services';
import ServiceLocator from '../services/ServiceLocator';

let router = Router();

router.post('/project/import', async (req: Request, res: Response, next: NextFunction) => {

  try {
    
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
  
    res.json({ project , artefacts: artefacts });
  } catch(e){

    next(e);
  }

});

router.get('/projects', async (req: Request, res: Response, next: NextFunction) => {

  try {
    let projectRepository = (await ServiceLocator
      .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');
  
    let allProjects = await (await projectRepository).listAll();
  
    res.json({allProjects: allProjects});
    
  } catch (e){
    next(e);
  }
});

router.get('/projects/:id', async (req: Request, res: Response, next: NextFunction) => {

  try {
    let id = req.params.id as string;
  
    let projectRepository = await (await ServiceLocator
      .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');
  
    let projectData = await projectRepository.findOne(id);
  
    res.json({projectData: projectData});

  } catch(e){

    next(e);
  }
});


router.delete('/project/delete/:id', async (req: Request, res: Response, next: NextFunction) => {

  try {
    let id = req.params.id as string;
  
    let projectRepository = await (await ServiceLocator
      .get<SERVICE_REPOSITORY_FACTORY>(SERVICE_REPOSITORY_FACTORY)).getRepository('project');
  
    await projectRepository.delete(id);
  
    res.json({ succeess: true });

  } catch(e){

    next(e);
  }
})


export default router;