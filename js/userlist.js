$(function(){
    let checkList=null
    //实现显示部门
    initDeptAndJob()
    async function initDeptAndJob(){
        let departmentData =await queryDepart()
        if(departmentData.code==0){  //成功了
            departmentData=departmentData.data
            let str=`<option value="0">全部</option>`
            departmentData.forEach(item => {
                str+=`<option value="${item.id}">${item.name}</option>`
            });
            $('.selectBox').html(str)
        }
    }

    //展示员工列表
    showUserList()
    async function showUserList(){
        //封装两个条件参数
        let params={
            departmentId:$('.selectBox').val(),
            search:$('.searchInp').val().trim()
        }
        // console.log(params.departmentId)
        let result=await axios.get('/user/list',{params})
        
        if(result.code!==0) return alert('获取失败')
        let str=``
        result.data.forEach(item=>{
            let{
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            }=item
            str+=`<tr>
            <td class="w3"><input type="checkbox" userId='${id}'></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex==0?'男':'女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userid='${id}'>
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>`
        })
        $('tbody').html(str)
        checkList=$('tbody').find('input[type="checkbox"]')
        // console.log(checkList); 
    }

    //根据条件显示员工列表
    searchHandle()
    function searchHandle(){
        $('.selectBox').change(showUserList)
        $('.searchInp').on('keydown',e=>{
            if(e.keyCode==13){ 
                showUserList()  
            }
        })
    }
    //基于事件委托使用编辑、删除和重置密码
    delegate()
    function delegate(){
        $('tbody').on('click',"a",async function(e){
            let target=e.target,
                tag=target.tagName,
                text=target.innerHTML.trim();
            if(tag=='A'){
                let userId=$(target).parent().attr('userid')
                // console.log(userId);
                if(text=='编辑'){
                    //跳转到添加用户页面，进行编辑要传一个id
                    window.location.href=`useradd.html?id=${userId}`
                    return
                }
                if(text=='删除'){
                    let flag=confirm('你确定要删除此用户吗')
                    if(!flag) return
                    let result = await axios.get('/user/delete',{params:{userId}})
                    if(result.code==0){
                        alert('删除用户成功')
                        $(target).parent().parent().remove()
                        checkList=$('tbody').find('input[type="checkbox"]')
                        return
                    }
                    return
                }
                if(text=='重置密码'){
                    let flag=confirm('你确定要重置此用户的密码吗')
                    if(!flag) return
                    let result=await axios.post('/user/resetpassword',{userId})
                    if(result.code==0) return alert('重置密码成功')
                    return
                }
            }
        })
    }
    //全选处理
    selectHandle()
    function selectHandle(){
        $('#checkAll').click(e=>{
            let checked=$('#checkAll').prop('checked')  //判断点击后的此状态
            checkList.prop('checked',checked)
        })
        $('tbody').on('click','input',e=>{
            if(e.target.tagName==='INPUT'){
                let flag=true
                newcheckList=Array.from(checkList)
                newcheckList.forEach(item=>{
                    if(!$(item).prop('checked')){
                        //有的用户框没有被勾选
                        flag=false
                    }
                })
                $('#checkAll').prop('checked',flag)
            }
        })
    }
    
    //实现批量删除
    $('.deleteAll').click(e=>{
        //找到你勾选的用户,八次用户的userId放到一个数组中
        let arr=[];
        [].forEach.call(checkList,item=>{
            if($(item).prop('checked')){
                //选中了把这个input的id放到数组中
                arr.push($(item).attr('userid'))
            }
        })
        // console.log(arr);
        if(arr.length==0) return alert('你需要先选择')
        let flag=confirm('你确定要删除选择的的用户吗')
        if(!flag) return
        //利用递归进行批量删除
        
        let index=-1
        deleteUser()
        async function deleteUser(){
            let userId=arr[++index]
            if(index>=arr.length){ //递归的出口
                alert('删除完毕')
                showUserList()
                return
            }
            
            let result=await axios.get('/user/delete',{
                params:{userId}
            })
            if(result.code!==0)  return
            deleteUser()
        }

       
    })
})