$(function(){

    //登录功能
    $('.submit').click(async function(e){
        // console.log(111);
        let account=$('.userName').val().trim()
        let password=$('.userPass').val().trim()

        if(account=="" || password==""){
            return alert('账号和密码不能为空')
         }
        //md5对密码进行加密
        password=md5(password)
        //是由axios发出ajax请求
        /*axios.post('/user/login',{
            account,
            password
        }).then(res=>{
            console.log(res)   //因为是axios请求，所以数据在res.data里面,因此配置响应拦截器
        }).catch(err=>{
            console.log(err);
        })*/
        //async+await 是目前最优雅的解决方案
        let res=await axios.post('/user/login',{account,password}) //await后面跟上一个promise，就可以得到成功的结果
        // console.log(res)
        if(parseInt(res.code)===0) {
            alert('登录成功')
            window.location.href='index.html'
            return
        }
        alert('用户名或密码错误')
    })
        //如果没有在响应拦截器统一处理错误，通过async和await得到的只是一个成功的结果，失败的结果得不到。
})