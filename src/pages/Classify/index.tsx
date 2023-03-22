import React,{memo, useEffect,useState} from 'react';
import Breadcrumb from '@/components/breadCrumb';
import SelectGoods from '@/components/classify/selectGoods'
import List from '@/components/classify/list'
import { useRequest } from '@umijs/max';
import {queryGetGoodsList,queryGetClassifyList} from '@/services/classify'
import { Skeleton,Button } from 'antd';

import './index.less';

export default memo(function Page() {
  const [page, setPage] = useState({current:1,pageSize:12});
  const [selectSort,setSelectSort]=useState('');
  const {data:classifyList,loading:classifyLoading,error:classifyError}=useRequest(queryGetClassifyList,{ cacheKey: 'classifyListKey'})
  const {data:goodsList,loading:goodsLoading,error:goodsError,run } =useRequest((params)=>
  queryGetGoodsList(params),{ 
    manual: true,
    cacheKey: 'goodsListKey',
  });
  useEffect(()=>{
    run(page);
  },[]);
  const updateList=(params:any,updatePage:any=page)=>{
    setPage(updatePage);
    run({...params,...updatePage});
  };
  const sort=(type:string)=>{
    switch(type){
      case 'price':
        if(selectSort=='price') {return ;}
        else setSelectSort('price');
        goodsList.list?.sort((a:any,b:any)=>{
          return a.defaultPrice-b.defaultPrice;
        })
        break;
      case 'stock':
        if(selectSort=='stock') { return ;}
        else setSelectSort('stock');
        goodsList.list?.forEach((item:any)=>{
          let arr=item.specification.compose.map((it:any)=>{
            return it.stock;
          });
          item.stock=Math.max(...arr);
        });
        goodsList.list?.sort((a:any,b:any)=>{
          return +a.stock-(+b.stock);
        })
        break;
      default:
        setSelectSort("");
    }
  }
  return (
    <div>
      <div className="my-classify w-11/12 m-auto" >
        <Breadcrumb items={[{path:"/classify",title:"宠物用品"}]}/>
        <div className="selectGoods w-full ">
            {classifyLoading?<Skeleton active />:<SelectGoods classifyList={classifyList} update={updateList} sort={sort} total={goodsList?.list.length}/>}
        </div>
        <div className="space-x-3 py-2 my-sort my-4">排序方式： 
          <Button type="primary" className={selectSort=='price'?"":"!bg-gray-500"} onClick={()=>sort('price')}>
            价格<span className="iconfont icon-jiantou"></span>
          </Button>
          <Button type="primary" className={selectSort=='stock'?"":"!bg-gray-500"}onClick={()=>sort('stock')}>
            销量<span className="iconfont icon-jiantou"></span>
          </Button>
        </div>
        {goodsLoading?<Skeleton active />:<List pageShow={true} goodsList={goodsList} update={updateList} page={page}/>}
      </div>   
    </div>
  );
})
