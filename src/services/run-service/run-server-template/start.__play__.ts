
declare var global;

global.__show__<%= id %> = function(data){

  console.log('d', data);
};

let runFile = require("<%= runFilePath %>");

runFile.default.run[0]();

console.log(runFile.default);