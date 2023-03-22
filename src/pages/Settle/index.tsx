import React,{memo,useEffect,useState,useMemo} from 'react'
import {useModel,useNavigate} from '@umijs/max'
import withAuth from "@/hocs/withAuth";
import './index.less'
import Form from '@/components/settle/form'
import List from '@/components/settle/list'

export default withAuth(memo(()=>{
    const {nowBuy,setNowBuy}=useModel("cart") as any;
    const navigate=useNavigate();
    useEffect(()=>{
        if((nowBuy instanceof Array)) true;
        else if(!nowBuy.phone) navigate("/");
        return ()=>{
            setNowBuy({});
        }
    },[]);

    const [count,total]=useMemo(()=>{
        let count=0;
        let total=0;
        if(nowBuy instanceof Array)
            nowBuy?.forEach((item:any)=>{
                if(item.flag == 1){
                    total+=item.price*item.count;
                    count+=item.count;
                }
            })
        else {count=nowBuy.count;total=nowBuy.price;}
        return [count,total];
    },[nowBuy]);

    return (<>
    <div className="relative mt-4">
        <div className="my-SettlePage w-11/12 m-auto">
            <div className="left w-[70%]">
                <Form count={count} total={total} list={nowBuy}/>
                <List list={nowBuy}/>
            </div>
        </div>
    </div>
    </>)
}));