import WebsocketServer from "../services/ws/WebsocketServer";

export default (ws: WebsocketServer) => {

  ws.onConnection('run-data', ( params ) => {

    console.log("--------------> RUN WS");

    // params.ws.send('dadad');

    // store the ws socket for later usage

  })

}