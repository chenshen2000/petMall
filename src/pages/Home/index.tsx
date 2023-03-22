import { connect } from '@umijs/max';
import React,{ useEffect,useRef } from 'react';
import { Carousel,Skeleton  } from 'antd';
import {LeftOutlined,RightOutlined} from '@ant-design/icons'
import List from '@/components/home/List/List'
import catSnackImg1 from '@/assets/images/catSnack1.jpg'
import catSnackImg2 from '@/assets/images/catSnack2.jpg'
import catSupplyImg1 from '@/assets/images/catSupply1.jpg'
import catSupplyImg2 from '@/assets/images/catSupply2.jpg'
import dogSnackImg1 from '@/assets/images/dogSnack1.jpg'
import dogSnackImg2 from '@/assets/images/dogSnack2.png'
import dogSupplyImg1 from '@/assets/images/dogSupply1.jpg'
import dogSupplyImg2 from '@/assets/images/dogSupply2.jpg'
import guodu from '@/assets/images/guodu.jpg'
import  './index.less';
const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};


const HomePage: React.FC = ({ home, dispatch, loading }: any) => {
  useEffect(()=>{
    if(!home.lunboList.length)
      dispatch({
        type: 'home/fetchLunboList',
        payload: {
        },});
      dispatch({
        type: 'home/fetchcatSnackList',
        payload: {
          petClassify:'猫猫',
          goodsType:'食品'
        },});
  },[])
  const carouseLunbo = useRef(null) as any;
  return (
    <div style={{background: "#F5F5F5"}}>
      <div className="my-home w-11/12 m-auto" >
        <Skeleton active loading={loading} paragraph={{ rows: 12 }} >
          <div className="lunbo">
            <Carousel autoplay effect="fade" ref={carouseLunbo}>
              {home.lunboList?.map((item:any,index:number)=><img key={index} src={item} style={contentStyle}/>)}
            </Carousel>
            <LeftOutlined  className="lunbo-left" onClick={()=>carouseLunbo?.current.prev()}/>
            <RightOutlined className="lunbo-right" onClick={()=>{ carouseLunbo.current?.next();}}/>
          </div>
          <List title="猫粮和零食" img={[catSnackImg1,catSnackImg2]} list={home.catSnackList}/>
          <div><img src={guodu} className="w-full"/></div>
          <List title="猫用品" img={[catSupplyImg1,catSupplyImg2]} list={home.catSnackList}/>
          <List title="狗粮和零食" img={[dogSnackImg1,dogSnackImg2]} list={home.catSnackList}/>
          <div><img src={guodu} className="w-full"/></div>
          <List title="狗用品" img={[dogSupplyImg1,dogSupplyImg2]} list={home.catSnackList}/>
        </Skeleton>
      </div>
    </div>
  );
};

export default connect(({ home, loading }: any) => ({
  home: home,
  //表示user这个model有数据请求行为的时候，loading为true，没有请求的时候为false
  loading: loading.models.home,
  //当user的effects中的fetchUserList有异步请求行为时为true，没有请求行为时为false
  loadingList: loading.effects['']
}))(HomePage);
