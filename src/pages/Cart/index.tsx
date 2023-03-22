import React,{memo} from 'react'
import List from '@/components/cart/list'
import GuessLike from '@/components/guessLike'
import withAuth from "@/hocs/withAuth";
import "./index.less"

export default withAuth(memo(()=>{
    return (<>
    <div className="my-cart w-11/12 m-auto">
        <div className="flex flex-nowrap">
            <div className="my-list w-3/4">
                <List/>
            </div>
        </div>
        <GuessLike />
    </div>
    </>)
}));