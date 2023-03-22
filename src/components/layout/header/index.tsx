import React,{memo,useRef,useEffect,useState} from 'react'
import { Link,NavLink,useModel,useNavigate } from '@umijs/max';
import {queryGetCartList} from '@/services/user/index'
import { ProCard } from '@ant-design/pro-components';
import logo from '@/assets/images/logo.png'
import cartImg from '@/assets/images/cart.png'
import { Input,Badge} from 'antd';
import './index.less'
const { Search } = Input;

export default memo(function Index() {
  const {userInfo,resetData} =useModel('global');
  const {cartCount,setCart}=useModel('cart') as any;
  const [fixed,setFixed]=useState(false);
  //跳转个人中心
  const navigate=useNavigate();
  let logupRef=useRef() as any;
  //个人中心、退出登录的弹出选项显示与否
  const disappear=()=>{
    logupRef.current.style.display="none";
    setTimeout(()=>{
      logupRef.current.style.display="";
    },100)
  }
  //退登清理用户数据
  const logup=()=>{
    resetData();
    setCart([]);
    navigate("/",{replace:true});
  }
  //获取滚动条的高度
  const bindHandleScroll=(e:any)=>{
    // 滚动的高度(兼容多种浏览器)
   const scrollTop = (e.srcElement ? e.srcElement.documentElement.scrollTop : false)  || window.pageYOffset || (e.srcElement ? e.srcElement.body.scrollTop : 0);
   if(scrollTop>70)
    setFixed(true);
   else setFixed(false);
}
  useEffect(()=>{
    window.addEventListener('scroll', bindHandleScroll);
    if(userInfo.phone){
        queryGetCartList().then((data)=>{
            setCart([...data.data]);
        })
    }
    return ()=>{
      window.removeEventListener('scroll', bindHandleScroll);
    }
  },[])
  //跳转购物车
  const GoCart=()=>{
    if(!userInfo.phone) return navigate("/login");
    navigate("/cart");
  }
  let list=[
    { path: '/', title: '首页' },
    {path: '/dogSnack',title: "狗零食",},
    {path: '/dogSupply',title: "狗用品",},
    {path: '/catSnack',title: "猫零食",},
    { path: '/catSupply',title: "猫用品"},
    { path: '/classify', title: '所有商品' },
    { path: '/shoppingGuide', title: '购物指南' },
    { path: '/feedback', title: '联系我们' },
  ];
  let navList=list.map(item=>
      <li key={item.path} ><NavLink to={item.path} className="px-4 w-[7.5rem] float-left">{item.title}</NavLink></li>
    )
  return (
    <div className="layout-header">
      <div className="header1 h-16 leading-[4rem]">
        {   !userInfo.phone
            ?<>
              <div className="left leading-[4rem]">欢迎您登录宠物商城！</div>
              <div className="right">
                <Link to="/login">登录</Link>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <Link to="/register">注册</Link>
              </div>
            </>
            :<>
                <div className="left leading-[4rem]">欢迎您使用宠物商城！</div>
                <div className="right w-60 h-full !mr-8 flex items-center relative">
                    <img src={userInfo.avatar || '/upload/avatar/user-default.jpg'} className="w-14 h-14 rounded-full" />
                    <div className='pl-2'>欢迎，{userInfo.username}</div>
                    <ul ref={logupRef} className="logup h-20 absolute top-full z-10 left-1/4 bg-white  border text-md hidden rounded-bl-md rounded-br-md">
                      <li className="leading-10 border-b-[1px] px-6"><NavLink to="/user?key=1" onClick={disappear}>个人中心</NavLink></li>
                      <li className="leading-10 px-6"><a onClick={logup}>退出登录</a></li>
                    </ul>
                </div>
            </>
        }

      </div >
      <div className="header2">
          <ProCard style={{ marginBlockStart: 8 }} gutter={8}>
            <ProCard colSpan={{md: 12, lg: 8, xl: 8 }}>
              <div className="flex justify-start " onClick={()=>navigate('/')}>
                <img src={logo} className="w-[80px] h-[80px] inline-block " />
                <div className="flex-shrink-0 flex flex-col justify-center items-center w-26 pl-4 pr-4">
                  <h1 className="text-4xl font-bold text-blue-900 tracking-wider">宠物商城</h1>
                  <h3 className="text-2xl tracking-widest text-blue-900 text-opacity-80">Pet Mall</h3>
                </div>
              </div>
            </ProCard>
            <ProCard colSpan={{ md: 8, lg: 8, xl: 8 }}>
              <div className="h-[80px] SearchInput">
                <Search
                  placeholder="input search text"
                  enterButton="Search"
                  size="large"
                />
              </div>
            </ProCard>
            <ProCard colSpan={{ md: 0, lg: 4, xl: 4 }}></ProCard>
            <ProCard colSpan={{ md: 4, lg: 4, xl: 4 }} layout="center">
              <div className=" h-[80px] flex  cartBtn space-x-4 ">
                <div className="bg-orange-500 flex justify-around cartBtn h-[60px] w-[160px] px-4 rounded-md" onClick={GoCart}>
                  {/* <text
                    className="iconfont icon-gouwuche text-4xl "
                  /> */}
                  <Badge count={cartCount} size="small" offset={[0,4]}><img src={cartImg}/></Badge>
                  <div className="text-white text-center" style={{cursor:"default"}}>
                    购物车
                    {/* ：<span className="cartCount">{cartCount}</span>件 */}
                  </div>
                </div>
              </div>
            </ProCard>
          </ProCard>
        </div>
        <div className="header3">
          <nav id="nav"  className=" m-auto w-[64rem]">
            <ul >
                {navList}
            </ul>
          </nav>
        </div>
      <div className={fixed?"fixed top-[-10px] left-0 right-0 z-10":"hidden"}>
        <div className="header2">
          <ProCard style={{ marginBlockStart: 8 }} gutter={8}>
            <ProCard colSpan={{md: 12, lg: 8, xl: 8 }}>
              <div className="flex justify-start " onClick={()=>navigate('/')}>
                <img src={logo} className="w-[80px] h-[80px] inline-block " />
                <div className="flex-shrink-0 flex flex-col justify-center items-center w-26 pl-4 pr-4">
                  <h1 className="text-4xl font-bold text-blue-900 tracking-wider">宠物商城</h1>
                  <h3 className="text-2xl tracking-widest text-blue-900 text-opacity-80">Pet Mall</h3>
                </div>
              </div>
            </ProCard>
            <ProCard colSpan={{ md: 8, lg: 8, xl: 8 }}>
              <div className="h-[80px] SearchInput">
                <Search
                  placeholder="input search text"
                  enterButton="Search"
                  size="large"
                />
              </div>
            </ProCard>
            <ProCard colSpan={{ md: 0, lg: 4, xl: 4 }}></ProCard>
            <ProCard colSpan={{ md: 4, lg: 4, xl: 4 }} layout="center">
              <div className=" h-[80px] flex  cartBtn space-x-4 ">
                <div className="bg-orange-500 flex justify-around cartBtn h-[60px] w-[160px] px-4 rounded-md" onClick={GoCart}>
                  {/* <text
                    className="iconfont icon-gouwuche text-4xl "
                  /> */}
                  <Badge count={cartCount} size="small" offset={[0,4]}><img src={cartImg}/></Badge>
                  <div className="text-white text-center" style={{cursor:"default"}}>
                    购物车
                    {/* ：<span className="cartCount">{cartCount}</span>件 */}
                  </div>
                </div>
              </div>
            </ProCard>
          </ProCard>
        </div>
        <div className="header3">
          <nav id="nav"  className=" m-auto w-[64rem]">
            <ul >
                {navList}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
});
