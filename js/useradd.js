$(function(){
    let userId=null
    let params=window.location.href.queryURLParams()   //utils.js写了queryURLParams这个方法，并挂载到了原型上
    if(params.hasOwnProperty('id')){
        userId=params.id
        // console.log(params);
        //根据id获取用户的信息，实现数据回显
        getBaseInfo()
    }
    //async 修饰的函数，最终单会的是promise
    async function getBaseInfo(){
        let result=await axios.get('/user/info',{
            params:{userId}
        })
        
        if(result.code===0){
            //给表单中塞数据，实现数据回显
            result = result.data
            $('.username').val(result.name)
            result.sex==0?$('#man').prop('checked',true):$('#woman').prop('checked',true)
            $('.useremail').val(result.email)
            $('.userphone').val(result.phone)
            $('.userdepartment').val(result.departmentId)
            $('.userjob').val(result.jobId)
            $('.userdesc').val(result.desc)
            return
        }
        alert('编辑失败')
        userId=null
    }

    //初始化部门和职务的数据
    initDeptAndJob()

    async function initDeptAndJob(){
        let departmentData =await queryDepart()
        let jobData =await queryJob()
        // console.log(departmentData);
        if(departmentData.code==0){  //成功了
            departmentData=departmentData.data
            let str=``
            departmentData.forEach(item => {
                str+=`<option value="${item.id}">${item.name}</option>`
            });
            $('.userdepartment').html(str)
        } 
        if(jobData.code==0){
            jobData=jobData.data
            let str=``
            jobData.forEach(item => {
                str+=`<option value="${item.id}">${item.name}</option>`
            })
            $('.userjob').html(str)
        }
    }
    //校验函数
    function checkname(){
        let val=$('.username').val().trim()
        if(val.length==0){
            $('.spanusername').html('此项为必填项')
            return false
        }
        //用户名字 必须是两个字到10个字
        var han = /^[\u4e00-\u9fa5]{2,10}$/
        if(!han.test(val)){
            $('.spanusername').html('用户名必须是2-10位的汉字')
            return false
        }
        //校验ok
        $('.spanusername').html('用户名ok')
        return true
    }
    function checkemail(){
        let val=$(".useremail").val().trim()
        if(val.length==0){
            $('.spanuseremail').html('此项为必填项')
            return false
        }
        let isemail=/^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
        if(!isemail.test(val)){
            $('.spanuseremail').html('邮箱格式不合法')
            return false
        }
        //校验ok
        $('.spanuseremail').html('邮箱ok')
        return true
    }
    function checkphone(){
        let val=$(".userphone").val().trim()
        if(val.length==0){
            $('.spanuserphone').html('此项为必填项')
            return false
        }
        let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
        if(!reg.test(val)){
            $('.spanuserphone').html('电话格式不合法')
            return false
        }
        //校验ok
        $('.spanuserphone').html('电话ok')
        return true
    }
    //失去焦点，对数据进行校验
    $('.username').blur(checkname)
    //邮箱验证
    $('.useremail').blur(checkemail)
    //手机号校验
    $('.userphone').blur(checkphone)
    
    $('.submit').click(async function(){
        if(!checkname() || !checkemail() || !checkphone()) {
            alert('你填写的数据不合法')
            return
        }
        //点击提交 再次对数据校验，校验通过
        //获取用户输入的数据
        let params={
            name:$('.username').val().trim(),
            sex:$('#man').prop('checked')?0:1, //sex的值要么是0要么是1 要和后端沟通好确定0和1那个代表的男那个是女
            email:$('.useremail').val().trim(),
            phone:$('.userphone').val().trim(),
            departmentId:$('.userdepartment').val(),
            jobId:$('.userjob').val(),
            desc:$('.userdesc').val().trim(),
        }
        // console.log(params);
        //判断是编辑还是新增
        if(userId){
            //编辑
            params.userId=userId
            let result=await axios.post('/user/update',params)
            if(result.code==0){
                alert('修改用户信息成功')
                window.location.href='userlist.html'
                return
            }
            alert('网络不给力')
            return //必须加return 不然会实现新增 
        }
        //实现新增
        let result=await axios.post('/user/add',params)
        if(result.code==0){
            alert('添加员工成功')
            window.location.href='userlist.html'
            return
        }
        alert('网络不给力,请稍后再试')
    })
})