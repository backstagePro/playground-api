import { Router, Request, Response, NextFunction} from 'express';

let router = Router();

router.get('/projects', (req: Request, res: Response, next: NextFunction) => {

  res.json({projects: []});
});

export default router;