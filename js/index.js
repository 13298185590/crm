$(function(){
    
    //获取元素
    let $navBoxList=$('.navBox>a')
    let $itemBoxList=null
    
    init()

    let $plan = $.Callbacks() //用来实现发布订阅
    $plan.add((_,baseInfo)=>{
        //渲染用户信息的名字
        $('.baseBox>span').html(`你好，${baseInfo.name||''}`)

        //实现退出登录
        $('.baseBox>a').click(async function(){
           let result= await axios.get('/user/signout')
           if(result.code==0){
               //退出登录成功
               window.location.href='login.html'
               return
           }
           //退出登录失败
           alert('网络不给力,请稍后再试')
        })
    })
    $plan.add((power)=>{
        //根据不同权限渲染菜单  userhandle|departhandle|jobhandle|customerall
        let str =``
        //如果用户具备员工管理权限
        if(power.includes('userhandle')){
            str+=`
			<div class="itemBox" text="员工管理">
				<h3><i class="iconfont icon-yuangong"></i>员工管理</h3>
			<nav class="item">
				<a href="page/userlist.html" target="iframeBox">员工列表</a>
				<a href="page/useradd.html" target="iframeBox">新增员工</a>
			</nav>
            </div>
		`
        }
         //如果用户具备部门管理
        if(power.includes('departhandle')){
            str+=`
			<div class="itemBox" text="部门管理">
				<h3><i class="iconfont icon-yuangong"></i>部门管理</h3>
			<nav class="item">
				<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
				<a href="page/departmentadd.html" target="iframeBox">新增职位</a>
			</nav>
            </div>
		`
        }
        //如果用户具备职位管理
        if(power.includes('jobhandle')){
            str+=`
			<div class="itemBox" text="职位管理">
				<h3><i class="iconfont icon-yuangong"></i>职位管理</h3>
			<nav class="item">
				<a href="page/joblist.html" target="iframeBox">职位列表</a>
				<a href="page/jobadd.html" target="iframeBox">新增职位</a>
			</nav>
            </div>
		`
        }
        //如果用户具备客户管理
        if(power.includes('customerall')){
            str+=`
			<div class="itemBox" text="客户管理">
				<h3><i class="iconfont icon-kehuguanli"></i>客户管理</h3>
			<nav class="item">
				<a href="page/customerlist.html?lx=my" target="iframeBox" >我的客户</a>
				<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>
				<a href="page/customeradd.html" target="iframeBox">新增客户</a>
			</nav>
            </div>
		`
        }
        $('.menuBox').html(str)

        $itemBoxList=$('.menuBox').find('.itemBox')
    })
    //实现table选项卡的功能 控制组织机构和客户管理点击切换
    function handGroup(i){
        // console.log($itemBoxList)
        //分两组 $group1 $group2
        let $group1=$itemBoxList.filter((index,item)=>{
            let text=$(item).attr('text')
            
            return text=='客户管理'
        })
        let $group2=$itemBoxList.filter((index,item)=>{
            let text=$(item).attr('text')
            return /^(员工管理|部门管理|职位管理)/.test(text)
        })
        //控制那一组显示
        if(i==0){
            $group1.css('display','block')
            $group2.css('display','none')
        }else if(i==1){
            $group1.css('display','none')
            $group2.css('display','block')
        }

    }

    $plan.add(power=>{
        //控制默认显示哪一个
        let initIndex=power.includes('customerall')?0:1
        $navBoxList.eq(initIndex).addClass('active').siblings().removeClass("active")
        handGroup(initIndex)

        //点击切换
        $navBoxList.click(function(){
            let index=$(this).index()
            let text=$(this).html().trim()
            // 今日头条：userhandle|departhandle|jobhandle|customerall
            //旺财：customerall 
            //点击权限之前，做权限控制
            // if((text=='客户管理') && !/customerall/.test(power))
            // if((text=='组织结构') && !/(userhandle|departhandle|jobhandle)/.test(power))
            if((text=='客户管理') && !/customerall/.test(power) || (text=='组织结构') && !/(userhandle|departhandle|jobhandle)/.test(power)){
            alert('抱歉,你还没有权限访问')
            return}
            // if(index==initIndex) return
            $(this).addClass('active').siblings().removeClass("active")
            handGroup(index)
        })
        
    })
    //控制默认的iframe的src
    $plan.add(power=>{
        let url='page/customerlist.html'
        if(power.includes('customerall')){
            $('.iframeBox').attr('src',url)
        }
    })

    async function init(){
        //判断当前用户是否登录
        let result=await axios.get('/user/login')
        // console.log(result)
        if(result.code !=0){
            alert('你还没有登录,请先登录！')
            window.location.href='login.html'
            return 
        }
        let [power,baseInfo]=await axios.all([
            axios.get('/user/power'),
            axios.get('/user/info')
        ])
        baseInfo.code===0?baseInfo=baseInfo.data:null;
        power.code==0?power=power.power:null;

        $plan.fire(power,baseInfo)
    }
})