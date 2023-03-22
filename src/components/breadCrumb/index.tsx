import React,{memo} from 'react';
import { Breadcrumb } from 'antd';
import {useNavigate} from '@umijs/max'
import './index.less'

export default memo((props:any)=>{
    const navigate=useNavigate();
    const items = [
        {
          path: '/',
          title: '首页',
        },
        ...props.items
      ];
      function itemRender(item:any, params:any, items:any, paths:any) {
        const last = items.indexOf(item) === items.length - 1;
        let path=paths.pop();
        return last ? <span className="text-black " onClick={(e)=>{e.preventDefault();}}>{item.title}</span> : <span onClick={(e)=>{e.preventDefault();navigate("/"+path)}} >{item.title}</span>;
      }
      
      return <Breadcrumb separator=">" itemRender={itemRender} items={items}  className="my-breadcrumb my-4 py-3 text-base"/>;
})
