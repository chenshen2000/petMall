import React, { memo } from 'react';
import {useRequest,useNavigate,useModel} from '@umijs/max'
import { ProCard } from '@ant-design/pro-components';
import { Skeleton } from 'antd';
import {queryGetShoppingGuideList,queryGetNewGoodsList} from '@/services/guide'
import  './index.less';

export default memo(function Page() {
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
  const {data:GuideList,loading:GuideLoading,error:GuideError} =useRequest(queryGetShoppingGuideList,{ cacheKey: 'GuideListKey'});
  const {data:NewGoodsList,loading:NewGoodsLoading,error:NewError}=useRequest(()=>
    queryGetNewGoodsList({current:1,pageSize:6,isNew:1}),{ cacheKey: 'NewGoodsListKey'}
  )
  return (
    <div >
      <div className="my-shop-guide w-11/12 m-auto flex mt-8">
        <div className="w-2/3 left">
          <h1 className="title ">购物指南</h1>
          {
            GuideLoading?<Skeleton active />:
            GuideList.map((item:any)=><ProCard title={item.title.replace("。?","?  ")}  style={{ maxWidth: 300 }} bordered className="my-8 !max-w-none" key={item.id}>
            <div className="content">{item.content}</div>
            <div className="footer">
              发布时间：<span>{item.createTime}</span>&nbsp;&nbsp;&nbsp;&nbsp;阅读：<span>{item.click}</span>
            </div>
          </ProCard>)
          }
        </div>
        <div className="w-1/3 pl-14 right">
          <div className="content">
            <h1 className="title">新品推荐</h1>
            {
            NewGoodsLoading?<Skeleton active />:
            NewGoodsList.list.map((item:any)=><div key={item.goodsId} className="my-border-bottom pb-10"><div  className="w-[240px]  h-1/2  bg-white mt-4 mx-auto"
                    onClick={()=>navigate(`/detail/${item.goodsId}`)}>
                    <img src={item.goodsCoverImage} className="w-full h-3/4 "/>
                    <div className="text-sm truncate px-4 py-2">{item.goodsName}</div>
                    <div className="flex justify-between px-7">
                      <div className="text-red-500 text-xl">￥{item.defaultPrice}</div>
                      <button className="w-20 bg-orange-400 text-white"  onClick={(e)=>{e.stopPropagation();nowBuy(item);}}>立即购买</button>
                    </div>
                  </div>
              </div>)
            }
          </div>
        </div>
      </div>
    </div>
  );
});
