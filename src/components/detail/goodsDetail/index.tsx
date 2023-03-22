import {memo} from 'react'

type IProps={
    list:string[];
}

export default memo((props:IProps)=>{
    return (<>
        <div className="w-2/3 mx-auto mt-8">
            {props.list.map((item:any)=>
            <div key={item}><img src={item} /></div>)}
        </div>
    </>)
})