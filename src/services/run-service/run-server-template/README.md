[1] - Generate a server files (**play**.ts) , need project path
[] - Generate a config file with path to the tested file
[2] - Start server, need project path to find the server.**play**.ts file, shell service

[] - Provide a path /run which will run the code in new process, the master server will collect all the data from the spawn process

- the data will be sand via websocket to the client

- execute code
- collect show data

[] - Start websocket server

[Browser]
[1] - Connect to websocket server ...

DO WE NEED Webscoket server?
What we will do if the server crashes?

- display collected data ...

Steps

RUN START

[1] - compile files AST
[2] - create files map and generate the clones
[3] - create a preview files
[4] - start server
[5] - spawn a new process from the server, which will be the tested service
[6] - server will collect all tha data from the spawn process

on the client
[1] - connect to websocket server
[2] - display the data

CHANGE FILE

{ Simple }

- Run shell command with the provided file and global functions...
  In this case we should generate a START file, also file with global functions...
  Store the last collected data into MongoDb ...

On the client pull last data from mongodb

[Websocket]

- create webscoket from the api
- use this socket to send data about the last pulled variable data
