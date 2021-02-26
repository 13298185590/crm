$(function(){
    let limit=10  //默认一页显示多少条数据
    let page=1   //默认显示第一页
    let totalPage=1
    let total=0    //tatal表示总的数据
    let lx='my';
    let params=window.location.href.queryURLParams()   //utils.js写了queryURLParams这个方法，并挂载到了原型上
    if(params.hasOwnProperty('lx')){
        lx=params.lx
        
    }
    // console.log(lx)
    //获取客户列表
    showCustmerList()
    async function showCustmerList(){
        let result=await axios.get('/customer/list',{
            params:{
                lx,
                type:$('.selectBox').val(),
                search:$('.searchInp').val().trim(),
                limit,
                page,
            }
        })
        if(result.code!==0) return alert('网络不给力')
        totalPage=parseInt(result.totalPage)
        total=parseInt(result.total)
        let str=``
        result=result.data
        result.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                QQ,
                weixin,
                type,
                address,
                userName
            } = item
            str+=`
               <tr>
				<td class="w8">${name}</td>
				<td class="w5">${sex==0?'男':'女'}</td>
				<td class="w10">${email}</td>
				<td class="w10">${phone}</td>
				<td class="w10">${weixin}</td>
				<td class="w10">${QQ}</td>
				<td class="w5">${type}</td>
				<td class="w8">${userName}</td>
				<td class="w20">${address}</td>
				<td class="w14" custromerId='${id}'>
					<a href="">编辑</a>
					<a href="">删除</a>
					<a href="">回访记录</a>
				</td>
			  </tr> 
            `
        });
        $('tbody').html(str)
        if(totalPage>1){  //要渲染分页
            str=``;
            page>1?str+=`<a href='javascript:;'>上一页</a>`:null;
            str+=`<ul class='pageNum'>`;
            for(let i=1;i<totalPage;i++){
                str+=`<li class='${i==page?"active":""}'>${i}</li>`
            }
            str+=`</ul>`;
            page<totalPage?str+=`<a href='javascript:;'>下一页</a>`:null;
            $('.pageBox').html(str)
        }
    }

    //其他功能
    handle()
    function handle(){
        $('.selectBox').change(showCustmerList)
        $('.searchInp').keydown(function(ev){
            if(ev.keyCode ===13 ){
                console.log(12);
                showCustmerList()
            }
        })
        //使用事件委托实现分页功能
        $('.pageBox').click(e=>{
            let target=e.target,
                tag=target.tagName,
                text=target.innerHTML,
                temp=page
            if(tag=='A'){
                //点击了上一页和下一页
                if(text=="上一页"){temp--}
                if(text=='下一页'){temp++}
            }
            if(tag=="LI"){
                //点击了中间的数字
                temp=parseInt(text)
            }
            if(temp!==page){
                page=temp
                showCustmerList()
                return
            }
        })
    }
})