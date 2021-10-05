
declare var global;
declare var __show__<%= id %>; 

global.__show__<%= id %> = function(data){

  console.log('[__$pl_data__]', JSON.stringify(data) + '\n');
};

let runFile = require("<%= runFilePath %>");

runFile.default.run[0]();