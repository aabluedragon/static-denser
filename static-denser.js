var path = require('path'),
    fs = require('fs'),
    resolve = path.resolve;

exports = module.exports = function staticDenseInit(root, options) {
    var fullRoot = resolve(root);
    var prefix = options&&options.dpiPrefix || '@';
    var suffix = options&&options.dpiSuffix || 'x';

    function staticDense(request,r,next) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return next();
        }
        try {
            var pathToCheckExist = path.join(fullRoot, request.url);
            fs.exists(pathToCheckExist, function(exist) {
                if(exist) {
                    next();
                } else {
                    var dpi = request.url.slice(1,request.url.indexOf("/",1));
                    if(!isNaN(dpi)) {
                        // let's check if a dense file exists.
                        var firstDirOfUrl = "/"+dpi;
                        var urlWithoutFirstDir = request.url.slice(firstDirOfUrl.length);
                        var indexOfQ = urlWithoutFirstDir.indexOf("?");
                        var qString;
                        var urlWithoutFirstDirAndQ;
                        if(indexOfQ !== -1 ) {
                            qString = urlWithoutFirstDir.slice(indexOfQ);
                            urlWithoutFirstDirAndQ = urlWithoutFirstDir.slice(0,indexOfQ);
                        } else {
                            qString = '';
                            urlWithoutFirstDirAndQ = urlWithoutFirstDir;
                        }
                        var dotIndex =  urlWithoutFirstDirAndQ.lastIndexOf(".");
                        var urlWithDpiFile = urlWithoutFirstDirAndQ.slice(0, dotIndex) + prefix+dpi+suffix + urlWithoutFirstDir.slice(dotIndex);

                        pathToCheckExist = path.join(fullRoot, urlWithDpiFile);
                        fs.exists(pathToCheckExist,function(exist){
                            if(exist) {
                                request.url = urlWithDpiFile + qString;
                            } else {
                                request.url = urlWithoutFirstDir;
                            }
                            next();
                        });
                    } else {
                        next();
                    }
                }
            });
        } catch(e) {
            next();
        }
    }

   return staticDense;
};