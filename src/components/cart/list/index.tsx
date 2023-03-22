import React, { useState,memo, useEffect } from 'react';
import { Table,Checkbox,InputNumber,Modal  } from 'antd';
import {useModel,useNavigate} from '@umijs/max'
import type { ColumnsType } from 'antd/es/table';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import Settle from '@/components/cart/settle'
import {debounce} from '@/utils/format.js'
import {updateCart,updateCartFlag,deleteCart,deleteCartAll} from '@/services/user'



export default memo(()=>{
    const [checkAll, setCheckAll] = useState(false);
    const {cart,setCart,cartCount}=useModel("cart") as any;
    const {userInfo}=useModel("global");
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(cart.map((item:any,index:number)=>{
        if(item.flag) return index;
    }));
    const navigate=useNavigate();
    const data:  cartItem[]= cart.map((item:cartItem,index:number)=>({
        ...item,key:index
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = async () => {
      await  deleteAll();
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    const onCheckAllChange = (e: CheckboxChangeEvent) => {
      setCheckAll(e.target.checked);
      if(e.target.checked)
        {
            setSelectedRowKeys(data.map((item,index)=>index));
            cart.forEach((item:any)=>{
                item.flag=1;
            })
        }
      else {
            setSelectedRowKeys([]);
            cart.forEach((item:any)=>{
                item.flag=0;
            })
        }
      setCart([...cart]);
    };
  
    const onSelectChange = (newSelectedRowKeys: React.Key[],selectedRows:any) => {
        cart.forEach((item:any)=>{
            item.flag=0;
        })
        newSelectedRowKeys.forEach((item:any)=>{
            cart[item].flag=1;
        })
      setCart([...cart]);
      setSelectedRowKeys(newSelectedRowKeys);
      if(newSelectedRowKeys.length < data.length) setCheckAll(false);
      else setCheckAll(true);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      columnTitle: <Checkbox  onChange={onCheckAllChange} checked={checkAll}>全选</Checkbox>,
      columnWidth:100,
    };
    const hasSelected = selectedRowKeys.length > 0;
    //匹配某个商品修改数量
    const match=debounce(async (record:cartItem,count:number)=>{
        let idx=cart.findIndex((item:any)=>{
            if(item.goodsId==record.goodsId && JSON.stringify(item.specification) == JSON.stringify(record.specification))
                return true;
        })
        if(idx != -1) cart[idx].count=count;
        await updateCart(cart[idx]);
        setCart([...cart]);
    },100);
    //购物车商品数量发生改变
    const changeCount=debounce((record:cartItem,e:any)=>{
        match(record,e);
    },100);
    //加数量
    const addCount=(record:cartItem)=>{
       record.count!++;
       if(record.count!>99) return record.count=99;
       match(record,record.count!);
    }
    //减数量
    const subCount=(record:cartItem)=>{
      record.count!--;
      if(record.count!<1) return record.count=1;
      match(record,record.count!);
    }
    //筛选规格格式
    const selectSPE=(record:any)=>{
        let temp=[];
        for(let key in record.specification){
         if(key != 'rule_name' && key!='price' && key != 'stock'){
           temp.push([key,record.specification[key]]);
         }
        }
        if(!temp.length) temp.push(['默认规格','默认'])
        return temp;
    }
    //删除商品
    const deleteGoods=async (record:cartItem)=>{
        let idx=cart.findIndex((item:any)=>{
            if(item.goodsId==record.goodsId && JSON.stringify(item.specification) == JSON.stringify(record.specification))
                return true;
        })
        if(idx != -1) cart.splice(idx,1)
        setCart([...cart]);
        setSelectedRowKeys(cart.map((item:any,index:number)=>{
            if(item.flag) return index;
        }));
        await deleteCart(record);
        setTimeout(()=>{
            if(selectedRowKeys.length < data.length) setCheckAll(false);
            else setCheckAll(true);
        },1)
    }
    //删除所有商品
    const deleteAll=async ()=>{
        await deleteCartAll({phone:userInfo.phone});
        setCart([]);
    }
    useEffect(()=>{
        setTimeout(()=>{
            let flag=true;
            cart.findIndex((item:any)=>{
                if(!+item.flag) return flag=false;
            })
            if(!cart.length) flag=false;
            if(flag) setCheckAll(true);
        },1)
    },[])
    useEffect(()=>{
            if(cart.length) updateCartFlag({list:cart});
    })
    const columns: ColumnsType<cartItem> = [
    {
        title: '商品信息',
        dataIndex: 'goodsName',
        width: "260px",
        render:(text,record)=>(
            <div className="flex flex-nowrap w-[260px]" onClick={()=>navigate(`/detail/${record.goodsId}`)} style={{cursor:"default"}}>
                <div className="w-1/3"><img src={record.goodsCoverImage}/></div>
                <div className="w-2/3 space-y-2 ml-4">
                    <div className="truncate">{record.goodsName}</div>
                    <div className="text-gray-500 space-y-2">{selectSPE(record).map((item:any,index:number)=>
                    <div key={index}>{item[0]}: <span className="pl-2">{item[1]}</span></div>)}</div>
                </div>
            </div>
        )
    },
    {
        title: '单价(元)',
        dataIndex: 'price',
        width:"120px",
        render: (text,record,index) => (
            <div className="text-center">￥{(+record.price!).toFixed(2)}元</div>
        )
    },
    {
        title: '数量',
        dataIndex: 'count',
        width:"105px",
        render:(text,record)=>(
            <div className="w-[105px] text-center">
                <InputNumber 
                addonBefore={<div style={{cursor:"default"}} onClick={()=>subCount(record)} className="leading-[32px] w-[32px]">-</div>} 
                addonAfter={<div style={{cursor:"default"}} onClick={()=>addCount(record)} className="leading-[32px] w-[32px]">+</div>}  
                className="w-[105px]"
                value={record.count}
                onChange={(e)=>changeCount(record,e)}
                min={1} max={99}/>
            </div>
        )
    },
    {
        title:"小计",
        dataIndex:'price',
        width:"120px",
        render: (text,record,index) => (
            <div className="text-center">￥{(record.count!*record!.price!).toFixed(2)}元</div>
        )
    },
    {
        title: '操作',
        key: 'action',
        width:"140px",
        render: (text,record) => (
            <div onClick={()=>deleteGoods(record)} 
            className="w-1/2 text-center p-2 text-white bg-red-600 mx-auto border rounded-md"
            style={{cursor:"default"}}
            >删 除</div>
        ),
    },
    ];
    return (<>
    <div className="relative">
        <div className="my-table">
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false}/>
            <div className="flex w-full justify-between py-4" style={{cursor:"default",borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
                <div className="pl-12 text-orange-700" onClick={()=>navigate("/classify")}>继续购物</div>
                <div className="pr-8 text-gray-500 iconfont icon-lajitong" onClick={showModal}> 清空购物车</div>
            </div>
        </div>
        <div className="my-settle absolute top-0 -right-2/4 w-1/3"><Settle count={cartCount} cartList={cart}/></div>
        <Modal title="温馨提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {cart.length?<p>是否要删除购物车中所有商品？</p>:<p>购物车中暂时没有可以删除的商品！</p>}
        </Modal>
    </div>
    </>)
});