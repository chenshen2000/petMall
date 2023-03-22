import React,{memo} from 'react'

type IProp={
    list: any;
}
export default memo((props:IProp)=>{
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
    const goodsList=()=>{
        let list;
        if(!(props.list instanceof Array)) list=[props.list];
        else list=[...props.list];
        
            return list.map((item:any,index:number)=>
            <tr key={index} className="border-b-gray-200 border-b-[1px] text-center">
                <td className="flex flex-nowrap ">
                    <div className="w-[140px]"><img src={item.goodsCoverImage}/></div>
                    <div className="ml-4 mt-3 text-left">
                        <div className='truncate '>{item.goodsName}</div>
                        <div className="text-gray-500 space-y-2  mt-4">{selectSPE(item).map((item:any,index:number)=>
                            <div key={index}>{item[0]}: <span className="pl-2">{item[1]}</span></div>)}</div>
                    </div>
                </td>
                <td>￥{(+item.price).toFixed(2)}元</td>
                <td>{item.count}</td>
                <td>{(+(item.count*item.price)).toFixed(2)}</td>
            </tr>)
    }
    return (<>
        <div className="w-[96%]">
             <div className="leading-[45px] w-full bg-gray-200 pl-4 text-lg">商品信息</div>
             <div >
                <table className="w-full">
                    <thead>
                        <tr className='leading-[45px]'>
                            <th className="text-left">商品</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goodsList()}
                    </tbody>
                </table>
             </div>
        </div>
    </>)
})