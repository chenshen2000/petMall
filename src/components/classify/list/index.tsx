import {memo,useState} from 'react'
import type { PaginationProps } from 'antd';
import { useNavigate,useModel } from '@umijs/max';
import { Pagination,ConfigProvider,Empty  } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

type goodsItem={
    goodsId:string;
    goodsName:string;
    goodsCoverImage:string;
    defaultPrice: number;
    specification:any;
}
type IProps={
    goodsList:{list:goodsItem[],total:number};
    update:(params:any,page:any)=>void;
    page:{
        current:number;
        pageSize:number;
    },
    pageShow:boolean;
}
export default memo((props:IProps)=>{
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
    const onChange: PaginationProps['onChange'] = (page,pageSize) => {
      props.update({},{current:page,pageSize})
    };

    return (<div>
        <div className="flex flex-wrap">
            {
                props.goodsList?.list.length?
                props.goodsList?.list.map(item=>
                <div className="border  w-[20%] my-4 mx-[2.5%] h-80" key={item.goodsId} onClick={()=>navigate(`/detail/${item.goodsId}`)}>
                    <div className="flex h-3/5 align-middle justify-center"><img src={item.goodsCoverImage}  className=" p-4"/></div>
                    <div className='text-center px-4 h-1/5'>{item.goodsName}</div>
                    <div className="flex justify-between px-7 py-4">
                        <div className="text-red-500 text-xl">￥{item.defaultPrice}</div>
                        <button className="w-20 bg-orange-400 rounded-lg text-white" onClick={(e)=>{e.stopPropagation();nowBuy(item);}}>立即购买</button>
                    </div>
                </div>)
                :<div className='text-center w-full'><Empty /></div>
            }
        </div>
        <div className="text-center my-6 !text-3xl">
        {props.pageShow?<ConfigProvider locale={zhCN} > 
            <Pagination  pageSize={props.page.pageSize} responsive current={props.page.current} onChange={onChange} total={props.goodsList?.total} showSizeChanger showQuickJumper/>
        </ConfigProvider>
        :<></>}
        </div>
    </div>)
})