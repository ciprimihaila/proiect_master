module.exports.validateParams=function(a,b){for(var c in a){if(void 0===b[c])return"Parameter "+c+" is required.";switch(a[c]){case"string":if("string"!=typeof b[c])return"Parameter "+c+" should be string.";break;case"int":if(b[c]=parseInt(b[c]),isNaN(b[c]))return"Parameter "+c+" should be number.";break;case"array":break;default:console.log("The specified type is invalid.")}}return null},module.exports.sendOkResponse=function(a,b,c){void 0===b&&(b=""),void 0===c&&(c=""),a.send(JSON.stringify({status:"ok",message:b,url:c}))},module.exports.sendErrorResponse=function(a,b,c){void 0===b&&(b=""),void 0===c&&(c=""),a.send(JSON.stringify({status:"error",message:b,url:c}))};