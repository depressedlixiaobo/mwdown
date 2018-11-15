const { app, BrowserWindow ,ipcMain} = require('electron')
const msg = require('./model/msg')
const fs = require('fs-extra')
const path = require('path')

const appDir = path.resolve(__dirname,'app')  

const createWindow = () => {
    // 创建浏览器窗口
    win = new BrowserWindow({ width: 1200, height: 800 })
    // 然后加载应用的 index.html。
    win.loadFile('./index.html')
    win.webContents.openDevTools()
}
/**
 * 所有接受消息的地方
 */
ipcMain.on( msg.dropfile.send, (event, filePaths) => {
    //重名的稍后添加 允许重复名称
    filePaths.forEach((item,index)=>{
        fs.copy(item, path.resolve(appDir,path.basename(item)))
        .then(() => {
            console.log('success!')
        })
        .catch(err => {
            console.error(err)
        })
    })
    

    event.sender.send(msg.dropfile.receive, JSON.stringify(filePaths))
})



app.on('ready', createWindow)