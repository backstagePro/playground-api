import chokidar from 'chokidar';

export default class WatchFiles {
  
  public startWather(dirPath: string){
    
    // Initialize watcher.
    const watcher = chokidar.watch( dirPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher
      .on('add', path => console.log(`File ${path} has been added`))
      .on('change', path => console.log(`File ${path} has been changed`))
      .on('unlink', path => console.log(`File ${path} has been removed`));


  }
}