import Directory from "./Directory";

export default class DirectoryManager {
 
    
    public async getDirectory(path: string): Promise<Directory> {

        let directory = new Directory(path);

        await directory.init();

        return directory;

    }
}