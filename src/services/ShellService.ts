
import { spawn } from 'child_process';
import { ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio } from 'node:child_process';
import util from 'util';
const exec = util.promisify(require('child_process').exec);

export default class ShellService {
  private command: string;

  /**
   * 
   * @param command - the shell command that will be executed
   */
  constructor(command: string){

      this.command = command;
  }

  /**
   * Execute command using "exec"
   */
  public exec(): Promise<{ stdout, stderr }> {
    return exec(this.command);
  }

  /**
   * This is the promisified version of spawn
   * 
   * @param params 
   * @param options 
   * @returns 
   */
  public spawn(
      params: Array< string > = [],
      options = {}
  ): Promise<{
      /**
       * This is the spawn process
       */
      process: ChildProcessWithoutNullStreams
  }>{

      return new Promise((res, rej) => {

          let proc = this.execCommandAsStream(params, options, {
              onExit: (  code  ) => {
                  if (code !== 0) {
                      rej(new Error(this.command + " exited with code " + code));
                  } else {

                      res({
                          process: proc        
                      });
                  }
              },
              onError: ( error ) => {
                  rej(new Error(this.command + " encountered error " + error.message));
              }
          });
      });
  }

  /**
   * Exec command using spawn
   * 
   * @param params 
   * @param options 
   * @param events 
   * @returns 
   */
  public execCommandAsStream(
      params: Array< string > = [],
      options: SpawnOptionsWithoutStdio,
      events: {
          onStdoutData?: (data) => void;
          onStderrData?: (data) => void;
          onError?: (error) => void;
          onClose?: (code, signal?) => void;
          onExit?: (code, exitSignal) => void;
          onDisconnect?:(code) => void;
      } = {}
  ): ChildProcessWithoutNullStreams {

      const child = spawn(this.command, params, options);

      child.stdout.on('data', (data) => {
          // console.log(`stdout:\n${data}`);
          events.onStdoutData && events.onStdoutData(data);
      });

      child.stderr.on('data', (data) => {
          // console.error(`stderr: ${data}`);
          events.onStderrData && events.onStderrData(data);
      });

      child.on('error', (error) => {
          // console.error(`error: ${error.message}`);
          events.onError && events.onError(error);
      });

      child.on('exit', function (exitCode, exitSignal) {
          
          events.onExit && events.onExit(  exitCode, exitSignal );
      });

      child.on('disconnect', function(data) {
          
          events.onDisconnect && events.onDisconnect(data); 
      });

      child.on('close', (code, signal) => {
          
          // console.log(`child process exited with code ${code}`);
          events.onClose && events.onClose(code, signal);
      });

      return child;

  }
}