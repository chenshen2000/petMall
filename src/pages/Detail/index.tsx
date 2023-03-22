import React,{memo,useState,useEffect} from 'react';
import './index.less';
import Breadcrumb from '@/components/breadCrumb';
import { useParams,useRequest,request,Navigate,useModel,useNavigate } from '@umijs/max';
import {addToCart,updateCart} from '@/services/user/index'
import { Skeleton,Carousel,Image,message  } from 'antd';
import cartImg from '@/assets/images/cart.png'
import Detail from '@/components/detail/goodsDetail'
import Comments from '@/components/detail/comments'
import Service from '@/components/detail/service'

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default memo(function Page() {
  const {goodsId}=useParams();
  const {userInfo} =useModel('global');
  const {cart,setCart,setNowBuy}=useModel('cart') as any;
  const navigate=useNavigate();
  const [visible, setVisible] = useState(false);
  const [tab,setTab]=useState(0);
  const [currentSPE,setCurrentSPE]=useState({}) as any;
  //当前已选择规格
  const specification=()=>{
    let temp=[];
     for(let key in currentSPE){
      if(key != 'rule_name' && key!='price' && key != 'stock'){
        temp.push(<span  key={key}>{currentSPE[key]};</span>)
      }
     }
     if(!temp.length) temp.push(<span key="default">默认;</span>)
     temp.push(<span key="last" className="pl-4">({currentSPE.stock !=0 ?`商品库存剩余${currentSPE.stock}件`:"商品已售罄"})</span>)
    return temp;
  }
  //匹配得到对应规格的价格和库存量
  const matchSPE=(key:string,item:string)=>{
    if(key!='默认规格')
     return currentSPE[key]==item?true:false;
    else return true;
  }
  //改变当前选择的规格
  const changeSPE=(key:string,item:string)=>{
    if(key=='默认规格') return;
    let temp :string[]=[];
    for(let k in currentSPE)
     if(k != 'rule_name' && k!='price' && k != 'stock' && k !=key)
        temp.push(k);
    let result=goodsInfo.specification.compose.find((it:any)=>{
      let flag=true;
       for(let k in temp)
          if(currentSPE[temp[k]]!=it[temp[k]]) {flag=false;break;}
       if(it[key]==item && flag) return true;
    });
    setCurrentSPE(result);
  }
  //获取商品数据
  const {data:goodsInfo,loading,error}=useRequest(()=>request(`/api/notoken/getGoodsInfo/${goodsId}`),{
    onSuccess(data){
      let temp={price:100000};
      data?.specification.compose.forEach((item:any)=>{
        if(temp.price>item.price){
          temp=item;
        }
      })
      setCurrentSPE(temp);
    }
  });
  //规格标签输出
  const seletedNode=()=>{
        let temp=[];
        for(let key in goodsInfo.specification.rule){
          temp.push(<li key={key} className="py-3">{key}：
          {
            goodsInfo.specification.rule[key].map((item:any)=>
            <span key={item} 
              onClick={()=>changeSPE(key,item)} style={{cursor:"pointer"}}
              className={`mx-4 p-2 border rounded-lg ${ matchSPE(key,item)?"active":""}`}>{item}</span> )
          }
          </li>);
      }
      return (<>
        <div className="py-4">现价：<span className="text-2xl text-red-500">￥</span><span>{currentSPE.price}元</span></div>
        <ul>
            {temp}
        </ul>
        <div className="text-sm pt-2">选择规格：{specification()}</div>
      </>)
  }
  //切换tab
  const changeTab=(type:number)=>{
      switch(type){
        case 0:
          setTab(0);
          break;
        case 1:
          setTab(1);
          break;
        case 2:
          setTab(2);
          break;
      }
  }
  //加入购物车
  const addCart=async ()=>{
    if(!userInfo.phone) return navigate("/login");
    let obj={flag:0,phone:userInfo.phone,goodsId:goodsInfo.goodsId,
      goodsCoverImage:goodsInfo.goodsCoverImage[0],goodsName:goodsInfo.goodsName,
      specification:currentSPE,price:currentSPE.price,count:1};
    let idx=cart.findIndex((item:any)=>{
      if(item.goodsId==obj.goodsId && item.specification.rule_name == obj.specification.rule_name)
          return true;
      else return false;});
    if(idx != -1) {
      cart[idx].count++;
      setCart([...cart]);
      await updateCart(cart[idx]);
    }else {
      setCart([...cart,obj]);
      await addToCart(obj);
    }
    message.success('商品添加成功!');
  }
  //立即购买
  const nowBuy=()=>{
    if(!userInfo.phone) return navigate("/login");
    let obj={flag:0,phone:userInfo.phone,goodsId:goodsInfo.goodsId,
      goodsCoverImage:goodsInfo.goodsCoverImage[0],goodsName:goodsInfo.goodsName,
      specification:currentSPE,price:currentSPE.price,count:1};
        setNowBuy(obj);
    setTimeout(()=>{
      navigate('/settle');
    },1)
  }
  return (
    <div>
      {
        loading?<Skeleton active paragraph={{ rows: 12 }}/>:
        goodsInfo?
        <div className="my-goods-detail w-11/12 m-auto" >
          <Breadcrumb items={[{path:"/classify",title:goodsInfo.petClassify},{path:"/detail",title:goodsInfo.goodsName}]}/>
          <div className="flex w-full space-x-16 px-20">
            <div className="w-1/3 border p-4 "> 
              <Carousel autoplay dots={false} className="!leading-[24rem]" effect="fade" >
                {goodsInfo.goodsCoverImage.map((item:any)=> 
                 <Image
                 key={item}
                 preview={{ visible: false }}
                 src={item}
                 onClick={() => setVisible(true)}
               />)}
                </Carousel>
            </div>
            <div className="w-2/3 h-[26rem] flex flex-nowrap flex-col justify-between">
              <div className="text-xl font-bold">{goodsInfo.goodsName}</div>
              <div className="select-specification">{seletedNode()} </div>
              <div className="px-4 space-x-16 flex my-8 text-white justify-center">
                <button className="border p-2 bg-red-600 rounded-md" onClick={nowBuy}>立即购买</button>
                <button className="flex items-center space-x-2 p-2 border bg-red-600 rounded-md" onClick={addCart}>
                  <img src={cartImg}/>
                  <span>加入购物车</span>
                </button>
              </div>
              <ul className="promise flex flex-wrap">
                <li>七天无理由退货</li>
                <li>百分之百官方正品</li>
                <li>全场满99元包邮</li>
                <li>欢迎收藏热门宝贝</li>
              </ul>
            </div>
          </div>
          <div className="my-detail-tab mt-8">
              <ul className="my-tab flex">
                <li  className={tab===0?"active":""} onClick={()=>changeTab(0)}>商品详情</li>
                <li  className={tab===1?"active":""} onClick={()=>changeTab(1)}>用户点评</li>
                <li  className={tab===2?"active":""} onClick={()=>changeTab(2)}>售后服务</li>
              </ul>
              <div style={{display:tab===0?"block":"none"}}> <Detail list={goodsInfo.DetailImage} /></div>
              <div className="my-comments">{ tab===1 && <Comments goodsId={goodsInfo.goodsId}/>}</div>
              <div style={{display:tab===2?"block":"none"}}> <Service /></div>
          </div>
          <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
                  {goodsInfo.goodsCoverImage.map((item:any)=> 
                    <Image key={item} src={item} />
                   )}
                  </Image.PreviewGroup>
          </div>
      </div>
        : <Navigate to="/" replace></Navigate>
      }
    </div>
  );
})
