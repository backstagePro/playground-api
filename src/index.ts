
import * as express from 'express';
import router from './routes/ProjectRouter';
import * as cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

// routing
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});