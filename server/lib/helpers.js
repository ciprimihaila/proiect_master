
/**
 * Validate that the specified keys are available in the object.
 *
 * @param params
 * @param object
 */
module.exports.validateParams = function (params, object) {
    for (var key in params) {
        
        if (object[key] === undefined) {
            return "Parameter " + key + " is required.";
        }
        switch (params[key]) {
            case 'string':
                if (typeof object[key] !== 'string') {
                    return  "Parameter " + key + " should be string.";
                }
                break;
            case 'int':
                object[key] = parseInt(object[key]);
                if (isNaN(object[key])) {
                    return  "Parameter " + key + " should be number.";
                }
                break;
            case 'array':
              break;
            default:
                console.log("The specified type is invalid.");
        }
    }
    return null;
};


/**
 * Send json as response with status ok
 * 
 * @param res
 * @param message
 * @param url
 */
module.exports.sendOkResponse = function (res, message, url) {
    if (message === undefined) {
        message = '';
    }
    if (url === undefined) {
        url = '';
    }
    res.send(JSON.stringify({status: 'ok', message: message, url: url}));
};

/**
 * Send json as response with status fail
 * 
 * @param res
 * @param message
 * @param url
 */ 
module.exports.sendErrorResponse = function (res, message, url) {
    if (message === undefined) {
        message = '';
    }
    if (url === undefined) {
        url = '';
    }
    res.send(JSON.stringify({status: 'error', message: message, url: url}));
};
