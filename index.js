const { app, BrowserWindow ,ipcMain} = require('electron')
const msg = require('./model/msg')
const fs = require('fs-extra')
const path = require('path')
const startServer = require('./server')


const appDir = path.resolve(__dirname,'app')  

const createWindow = () => {
    // 创建浏览器窗口
    win = new BrowserWindow({ width: 1200, height: 800 })
    // 然后加载应用的 index.html。
    win.loadFile('./index.html')
  //  win.webContents.openDevTools()
}
/**
 * 所有接受消息的地方
 */
ipcMain.on( msg.dropfile.send, (event, filePaths) => {
    //succFiles = []
    //重名的稍后添加 允许重复名称
    filePaths.forEach((item,index)=>{
        fs.copy(item, path.resolve(appDir,path.basename(item)))
        .then(() => {
         
          //   succFiles.push(item)
        })
        .catch(err => {
            console.error(err)
        })
    })
     //succFiles 合并之前的所有数据
    filenames = []
    fs.readdir(appDir,(error,files)=>{
        files = files.filter(t=>!t.startsWith('.'));
        files.forEach(item=>{
            filenames.push({name:path.basename(item),path:path.resolve(appDir,item)})
        })
        event.sender.send(msg.dropfile.receive, JSON.stringify(filenames))
    })
})



app.on('ready', createWindow)
startServer()