
import * as express from 'express';
import ProjectRouter from './routes/ProjectRouter';
import * as cors from 'cors';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// routing
app.use(ProjectRouter);


app.listen(port, () => {
  console.log(`Playground api listening at http://localhost:${port}`)
});