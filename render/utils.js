class utils {
    static on(event ,isStop, func){
        document.addEventListener(event,(e,...arg)=>{
            if(typeof isStop == 'function'){
                func =  isStop 
                isStop =false
            }

            if(isStop ){
                this.stop(e)
                func(e,...arg)
            }else{
                func&& func(e,...arg)
            }
           
        })
    }
    static stop(e){
        e.preventDefault();
        e.stopPropagation();
    }
}

module.exports = utils;