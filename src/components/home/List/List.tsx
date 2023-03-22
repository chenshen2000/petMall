import React,{memo} from 'react'
import { useNavigate,useModel } from '@umijs/max';
import './index.less'

interface listItem{
  goodsId:string;
  goodsName:string;
  goodsCoverImage:string;
  defaultPrice:number;
}

type IPorps={
  title:string;
  img:string[];
  list?:listItem[];
}

export default memo(function List(props:IPorps) {
  const navigate=useNavigate();
  const {setNowBuy}=useModel("cart");
  const {userInfo}=useModel("global");
  const nowBuy=(goodsInfo:any)=>{
    if(!userInfo.phone) return navigate("/login");
    let temp={price:100000};
    goodsInfo?.specification.compose.forEach((item:any)=>{
        if(temp.price>item.price){
          temp=item;
        }
      })
    let obj={flag:0,phone:userInfo.phone,goodsId:goodsInfo.goodsId,
      goodsCoverImage:goodsInfo.goodsCoverImage,goodsName:goodsInfo.goodsName,
      specification:temp,price:goodsInfo.defaultPrice,count:1};
        setNowBuy(obj);
    setTimeout(()=>{
      navigate('/settle');
    },1)
  }
  return (<div className="home-list mt-16">
      <h2 className="text-2xl tracking-widest text-orange-400">{props.title}</h2>
      <hr className="border-orange-400 border-t-2 my-4"></hr>
      <div className="flex flex-row h-[660px] pb-16">
        <div className='w-1/4 '>
          <img  src={props.img[0]} className=" mt-4 h-1/2"/>
          <img  src={props.img[1]} className=" mt-4 h-1/2"/>
        </div>
        <ul className='flex flex-1 flex-wrap'>
          {
            props.list?.map((item:listItem)=><li key={item.goodsId} className="w-[240px]  h-1/2 list-hover ml-8 bg-white rounded-2xl mt-4"
            onClick={()=>navigate(`/detail/${item.goodsId}`)}>
                <img src={item.goodsCoverImage} className="w-full h-3/4 rounded-tl-2xl rounded-tr-2xl"/>
                <div className="text-sm truncate px-4 py-2">{item.goodsName}</div>
                <div className="flex justify-between px-7">
                  <div className="text-red-500 text-xl">￥{item.defaultPrice}</div>
                  <button className="w-20 bg-orange-400 rounded-lg text-white" onClick={(e)=>{e.stopPropagation();nowBuy(item);}}>立即购买</button>
                </div>
            </li>)
          }
        </ul>
      </div>
  </div>)
})
