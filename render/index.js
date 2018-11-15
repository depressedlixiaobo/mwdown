const { ipcRenderer } = require('electron')
const utils = require('./utils')
const msg = require('../model/msg')
const QRCode = require('qrcode')

// 后端 通讯 
const init = () => {
    //文件拖入 窗口 回复
    ipcRenderer.on(msg.dropfile.receive, (e, arg) => {
         console.log(arg)
         console.log(e)
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
    getQRCode(){
        QRCode.toCanvas(document.getElementById('canvas'), 'sample text',{
            w:'400',
            width:'400'
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


    // .on('drop', e => {

    // })

    $('#getcode').click(()=>{
        render.getQRCode()
    })
})

