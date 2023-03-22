import {memo} from 'react'
import { useRequest,request } from '@umijs/max';
import { Skeleton,Avatar,List,Rate} from 'antd';
type IProps={
    goodsId:string;
}

export default memo((props :IProps)=>{
    const {data,loading,error}=useRequest(()=>request(`/api/notoken/getGoodsComments/${props.goodsId}`),
    {cacheKey:"commentsKey"});
    return (<>
        <div>
            {
                loading?<Skeleton/>:
                <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item:any, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<>
                        <Avatar src={item.avatar || '/upload/avatar/user-default.jpg'} size={60}/>
                        <div className="text-center text-gray-700">{item.username.substring(0,1)+"***"+item.username.substr(-1,1)}</div>
                        </>}
                      title={<>
                        <div><span className="text-md">商家评分：</span><Rate disabled defaultValue={item.rate} style={{color:"red",fontSize:"18px"}}/></div>
                        <div className=" text-gray-700 my-4 " style={{ fontFamily: "宋体" }}>{item.content}</div>
                        <div className="flex flex-wrap">{item.imgs && JSON.parse(item.imgs).map((item:any)=>
                            <img src={item} key={item} className="w-[60px]"
                            />)}</div>
                      </>}
                      description={item.createTime}
                    />
                  </List.Item>
                )}
              />
            }
        </div>
    </>)
})