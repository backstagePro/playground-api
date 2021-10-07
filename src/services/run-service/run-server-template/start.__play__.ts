
declare var global;
declare var __show__<%= id %>; 

let counter = 0;

global.__show__<%= id %> = function(data){

  console.log('[__$pl_data__]', JSON.stringify({...data, counter }) + '\n');

  counter++;
};

let runFile = require("<%= runFilePath %>");

runFile.default.run[0]();