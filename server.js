const fs = require('fs')
const path = require('path')
const http = require('http')
const URL = require('url')

/**
 *  
    
 * 
 * */

const appDir = path.resolve(__dirname,'app')  

const startServer = ()=>{
    http.createServer((req, res)=>{
        res.setHeader('Content-Type', 'text/html');
        let flag = false;
        
        var _thisurl  =  URL.parse(req.url).path
        if( _thisurl.indexOf('/down') > -1) {
           
            let parms = URL.parse(req.url,true).query
            // 查找appname
            let downFile =  path.resolve(appDir,parms.appname)
            if(fs.existsSync(downFile)){
                res.setHeader("Content-Type","application/octet-stream")
                res.setHeader("Content-Disposition",`attachment; filename=${encodeURIComponent(parms.appname)  }`)
                var stats = fs.statSync(downFile)
                res.setHeader('Content-Length', stats.size)
                fs.createReadStream(downFile).pipe(res);
            }else{
                flag =true
            }
            //parms.appname 
        }else{
            //404
           flag =  true
        }
        if(flag){
            res.writeHead(404,"未找到")
            res.end();
        }
    
    }).listen(19069);
    
}

module.exports = startServer
