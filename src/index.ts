
import express from 'express';
import ProjectRouter from './routes/ProjectRouter';
import RunRouter from "./routes/RunRouter";
import cors from 'cors';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// routing
app.use(ProjectRouter);
app.use(RunRouter);

app.listen(port, () => {
  console.log(`Playground api listening at http://localhost:${port}`)
});