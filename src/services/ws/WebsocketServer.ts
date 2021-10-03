
const querystring = require('querystring');
const WebSocket = require('ws');

export default class WebsocketServer {

    private wss: any = null;

    /**
     * Storage of all connected sockets
     */
    private clientsChannelMap = [];

    private onConnectionListeners = {};

    private onCloseListeners = {};

    /**
     * Extract information from websocket route
     * 
     * @param url 
     * @returns 
     */
    private extractChannelFromClientUrl(url: string){

        let splitUrlParts = url.split('?');

        let urlQueryParams = {};
        if(splitUrlParts[1] && splitUrlParts[1].length){
            urlQueryParams = querystring.parse(splitUrlParts[1]);
        }

        if(splitUrlParts[0].startsWith('/')){
            splitUrlParts[0] = splitUrlParts[0].substring(1);
        }

        let channel = splitUrlParts[0].split('/')[0];

        return {channel, urlQueryParams};
    }

    /**
     * Execute all 'connection' listeneres
     * 
     * @param channel 
     * @param data 
     */
    private runOnConnectionListeners(channel: string, data: { queryParams: any, ws: any }){

        if(this.onConnectionListeners[channel] === void(0)){
            return;
        }


        try {
            this.onConnectionListeners[channel].forEach((cb) => {
                cb(data);
            });
        } catch (e: any){

            data.ws.send("[error]:connection error => " + e.message);
        }

    }

    /**
     * Execute all 'close' listeneres, 'close' event is fired when the connection is closed
     * 
     * @param channel 
     * @param data 
     */
    private runOnCloseListeneres( channel: string,  data: { queryParams: any, ws: any } ){

        delete this.onConnectionListeners[channel];
        
        if(this.onCloseListeners[channel] === void(0)){
            return;
        }

        this.onCloseListeners[channel].forEach(( cb ) => {
            cb(data);
        });

        delete this.onCloseListeners[channel];

    }

    /**
     * Start websocket server on given host and port
     * 
     * @param host 
     * @param port 
     */
    public startServer(port: number){

        this.wss = new WebSocket.Server({
            port: port,
            clientTracking: true
        });

        this.wss.on('open', function open() {
            
            console.log('Websocket open');
        });

        this.wss.on('connection', (ws, req) => {

            let parsed = this.extractChannelFromClientUrl(req.url);

            if(parsed.channel === ''){
                console.error("Invalid connection, missing channel parameter");
                ws.terminate();
                return;
            }

            if(this.onConnectionListeners[parsed.channel] === void(0)){
                console.error("There is no listeneres for the channel:" + parsed.channel);
                ws.terminate();
                return;
            }

            if(this.clientsChannelMap[parsed.channel] === void(0)){
              this.clientsChannelMap[parsed.channel] = [];
            }

            // store the socket
            this.clientsChannelMap[parsed.channel].push(ws);
            
            ws.addEventListener('close', this.runOnCloseListeneres.bind(this, parsed.channel, { queryParams: parsed.urlQueryParams, ws: ws }), {once: true});

            this.runOnConnectionListeners(parsed.channel, { queryParams: parsed.urlQueryParams, ws: ws });

            console.log(`[WS] connected, channel: ${parsed.channel}`);
        });

    }

    /**
     * Add event listener function for websocket connection event
     * 
     * @param channel 
     * @param cb 
     */
    public onConnection(channel: string, cb: (params: {queryParams: any, ws: any}) => void){

        if(this.onConnectionListeners[channel] === void(0)){
            this.onConnectionListeners[channel] = [];
        }

        this.onConnectionListeners[channel].push(cb);
    }

     /**
     * Add event listener function for websocket connection event
     * 
     * @param channel 
     * @param cb 
     */
    public onClose(channel: string, cb: (params:{params: {queryParams: any, ws: any}}) => void){

        if(this.onCloseListeners[channel] === void(0)){
            this.onCloseListeners[channel] = [];
        }

        this.onCloseListeners[channel].push(cb);
    }

    /**
     * Send message to the given channel
     * 
     * @param channel 
     * @param message 
     */
    public sendMessage(channel: string, message: any){

        if(this.clientsChannelMap[channel] === void(0)){
            throw new Error('Missing socket for channel ' + channel);
        }

        let msg = {
            __channel__: channel, 
            ...message
        };

        let wss = this.clientsChannelMap[channel];

        wss.forEahc((ws) => {

          if(ws.readyState === WebSocket.OPEN){
              ws.send( JSON.stringify(msg));
          } else {
              throw new Error('Socket not open! channel: ' + channel);
          }
        });

    }

}