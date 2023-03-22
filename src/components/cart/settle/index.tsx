import React,{memo} from 'react'
import { useNavigate,useModel} from '@umijs/max'
import {message} from 'antd'
type IProp={
    count:number;
    cartList:cartItem[];
}

export default (props:IProp)=>{
    const navigate=useNavigate();
    const {setNowBuy}=useModel("cart");
    const totalPrice=()=>{
        let total=0;
        let count=0;
        props.cartList.forEach((item:any)=>{
            if(item.flag == 1){
                total+=item.price*item.count;
                count+=item.count;
            }
        })
        return [(+total).toFixed(2),count];
    }
    const settleToBuy=()=>{
        let buyArr=props.cartList.filter(item=>!!(+item.flag!));
        if(!buyArr.length) return message.error("没有选中商品或当前购物车中没有商品，无法结算！");
        setNowBuy(buyArr);
        setTimeout(()=>{
            navigate("/settle");
        },1);
    }
    return (<>
    <div className="header">
        <div className=" title iconfont icon-gouwuche"> 我的购物车</div>
        <div className="w-1/2 mx-auto mt-12 mb-12 space-y-4">
            <div>商品数量：<span>{totalPrice()[1]}</span></div>
            <div>商品金额：<span className="text-red-500">￥{totalPrice()[0]}</span></div>
             <button className="w-full py-2 bg-orange-600 rounded-md text-white" onClick={settleToBuy}>去结算</button>
        </div>
    </div>
    </>)
};