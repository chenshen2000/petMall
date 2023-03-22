import { update } from 'js-md5';
import {memo,useEffect,useState} from 'react'

type  classifyItem={
    id:number;
    name:string;
    classifyName:string;
    classifyValue: string[];
    active?:number;
}
type IProps={
    classifyList:classifyItem[];
    update:(params:any,page?:any)=>void;
    sort:(type:string)=>void;
    total:number;
}

export default memo((props:IProps)=>{
    const [list,setList]=useState(props.classifyList);
    useEffect(()=>{
        list?.forEach(item=>{
            item.active=-1;
        })
        setList(list);
      },[]);
    const onChange=(id:number,index:number)=>{
        let idx=list?.findIndex(item=>item.id==id);
        if(idx !== -1 && list[idx]!.active != index) list[idx]!.active=index;
        else list[idx]!.active=-1;
        let obj={} as any;
        list.map(item=>{
            if(item.active != -1 && item.id!=4){
                obj[item.name]=item.classifyValue[item.active!];
            }else obj['selectedPrice']=item.classifyValue[item.active!]
        })
        setList([...list]);
        props.update(obj);
        props.sort("");
    }
    return (<div >
        <div className="pl-4 py-4" style={{borderBottom:"1px solid rgb(216, 210, 210)"}}>宠物用品（共有<span>{props.total}</span>个商品）</div>
        <ul className="text-base">{ 
                list?.map((item)=><li key={item.id}  className="flex pl-4 py-4" style={{borderBottom:"1px solid rgb(216, 210, 210)"}}>
                    <div>{item.classifyName}：</div>
                    <ul className="flex">
                        {item.classifyValue.map((it,index)=>
                        <li key={it} className="mx-4">
                            <a className={item.active==index?"selectedActive selectA":"selectA"} 
                                style={{cursor:"pointer"}} onClick={()=>onChange(item.id,index)}>{it}
                            </a>
                        </li>)}
                    </ul>
                </li>)
            }
        </ul>
    </div>)
})