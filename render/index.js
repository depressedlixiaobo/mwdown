const { ipcRenderer } = require('electron')
const utils = require('./utils')
const msg = require('../model/msg')
const path = require('path')
const fs = require('fs-extra')
const QRCode = require('qrcode')
const address = require('address');


var template_table =  func =>(
    `<table>
                <tr>
                            <th>文件名</th>
                            <th>时间</th>
                            <th></th>
                        </tr>
                        ${func()}
                    </table>`
)
const getDataHtml = (files)=>{
    let htmlStr = template_table(() =>{
            
        let html =  files.map(item=>(
             `<tr>
                 <td>${item.name}</td>
                 <td>稍后添加</td>
                 <td class='down' name ='${item.name}'>下载</td>
              </tr>`
        ))
        return html.join('')
     })
   
     document.getElementById('root').innerHTML = htmlStr
}
 
// 后端 通讯 
const init = () => {
    //文件拖入 窗口 回复
    ipcRenderer.on(msg.dropfile.receive, (e, arg) => {
       
        let files = JSON.parse(arg)
        getDataHtml(files)
         
    })
}

init()



class RenderIndex {
    constructor() {

        this.init = this.init.bind(this)
        this.getQRCode = this.getQRCode.bind(this)
    }

    init() {
        utils.on('drop', true, e => {
            let fileList = [];
            for (let f of e.dataTransfer.files) {
                fileList.push(f.path)
            }
            ipcRenderer.send(msg.dropfile.send,fileList)
        })

        utils.on('dragover', true, e => {
           
        });
    }
    getQRCode(txt){
        QRCode.toCanvas(document.getElementById('canvas'), txt,{
            width:'300'
        }, function (error) {
            if (error) console.error(error)
            console.log('success!');
          })
    }

}
$(function () {
    let render = new RenderIndex()

    render.init()
    //文件拖入 窗口
    let filenames =[]
    const appDir = path.resolve(process.cwd(),'app')  
    fs.readdir(appDir,(error,files)=>{
       console.log(files)
        files.forEach(item=>{
           
            if( item.indexOf('.')!=0 )
            {
                filenames.push({name:path.basename(item),path:path.resolve(appDir,item)}) 
            }
        })
        getDataHtml(filenames)
    })
  
    // .on('drop', e => {

    // })
    $(document).on('click','.down',function(){
       let name = $(this).attr('name')
       
      render.getQRCode(`http://${address.ip()}:19069/down?appname=${encodeURIComponent(name) }`)
       
    })
    
})

