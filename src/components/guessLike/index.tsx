import React,{memo} from 'react'
import List from '@/components/classify/list'
import { useRequest,request } from '@umijs/max';
export default memo(()=>{
    const {data,loading,error}=useRequest(()=>request("/api/notoken/getGoodsList",{
        params:{isLike:1,current:1,pageSize:4}
    }),{
        cacheKey:"guessLikeKey"
    });
    const update=()=>{

    }
    return (<>
    <div className="mt-16">
        <div className="w-full leading-[45px] pl-4 bg-gray-200">猜你喜欢</div>
        <List goodsList={data} page={{current:1,pageSize:10}} update={update} pageShow={false}/>
    </div>
    </>)
});