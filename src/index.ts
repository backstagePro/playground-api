
import express from 'express';
import ProjectRouter from './routes/ProjectRouter';
import RunRouter from "./routes/RunRouter";
import Run from '../src/ws/Run';
import cors from 'cors';
import ServiceLocator from './services/ServiceLocator';
import { SERVICE_WEBSOCKET_SERVER } from './services';

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

// Init websockets
ServiceLocator.get<SERVICE_WEBSOCKET_SERVER>(SERVICE_WEBSOCKET_SERVER).then((server) => {
  console.log("Starting websocket server")
  
  server.startServer(8081);

  // add sockets for runs
  Run(server);
});