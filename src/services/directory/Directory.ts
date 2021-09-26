

import * as path from 'path';
import {promises as fsp} from "fs"
import fsExtra from 'fs-extra';
import * as oldfs from "fs";
import glob from 'fast-glob';

/**
 * Abstraction on top of given directory folder
 * 
 */
export default class Directory {

    /**
     * Path to directory
     */
    private path: string;
 
    constructor(_path: string){

        this.path = _path;
    }

     /**
     ***********************************************************
     * PRIVATE METHODS
     *********************************************************** 
     */

    /**
     * Returns the full path of the file or directory by appending the directory path at the beginning of the provided path
     * argument
     * 
     * @param _path 
     * @returns 
     */
    private buildFullPath(_path: string): string {

        return path.join(this.path, _path);
    }

    private checkIfDirExists( path: string ): Promise<boolean>{

        return new Promise((res, rej) => {

            oldfs.stat(path, function (err, stats){
                
                if (err) {
                  // Directory doesn't exist or something.
                  rej(err);
                  return;
                }
                
                if (!stats.isDirectory()) {
                    
                  // This isn't a directory!
                  res(false);

                } else {
                  
                  res(true);
                }
            });
        })
    }

    /**
     ***********************************************************
     * PUBLIC METHODS
     *********************************************************** 
     */

    /**
     * Check if directory exists, if it doesn't exist, create it.
     */
    public async init(){

        try {

            // check if dir exists
            await this.checkIfDirExists( this.path );

        } catch(e){

            // create dir
            (await fsp.mkdir(this.path, { recursive: true }))
        }
    }

    /**
     * Create a file inside of the directory
     * 
     * @param path 
     * @param content 
     */
    async createFile(path: string, content: string){

        let _path = this.buildFullPath(path);
        return (await fsp.writeFile(_path, content, { encoding: 'utf8' }));
    }

    /**
     * Delete file inside of the directory
     * 
     * @param path 
     */
    async deleteFile(path: string){
        let _path = this.buildFullPath(path);
        return (await fsp.unlink(_path));
    }

    /**
     * 
     * Create (recursive) directory inside of the directory
     * 
     * @param path - example 'test/foo' or just 'test'
     */
    async createDir(path: string){
        let _path = this.buildFullPath(path);
        return (await fsp.mkdir(_path, { recursive: true }))
    }

    /**
     * Delete directory which is located inside of the current directory path
     * 
     * @param path 
     */
    async deleteDir(path: string){

        let _path = this.buildFullPath(path);
        return (await fsExtra.remove(_path));
    }

    /**
     * Clone the current directory to given path
     * 
     * @param path - path where to clone the directory 
     */
    async cloneDirectory( targetPath: string, distPath: string ){

        targetPath = path.resolve(this.path, targetPath);

        await fsExtra.copy(targetPath, distPath);
    }

    /**
     * @param globPattern 
     * @returns - returns array of the path relative to directory
     */
    async findFileByPattern(globPattern: string ): Promise<string[]>{

        return (await glob(globPattern, {cwd: this.path }));
    }

    /**
     * Remove the directory, when called every other operation after that will be not valid
     */
    async destroy(){

        return (await fsp.rmdir(this.path));
    }

    /**
     * Get the directory path
     * 
     * @returns 
     */
    public getPath(): string {

        return this.path;
    }

    /**
     * Execute file from given path, which is relative to directory
     * 
     * @param filePath 
     */
    async requreFile(filePath: string){

        return require(path.join(this.path, filePath));
    }
}