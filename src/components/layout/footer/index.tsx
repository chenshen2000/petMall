import React,{memo} from 'react'
import { ProCard } from '@ant-design/pro-components';
import logo from '@/assets/images/logo.png'
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import './index.less'
export default memo(function Index() {
  function top() {
    let currentPosition, timer:any,tempPosition :number=100000;
    timer = setInterval(function () {
      currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
      if(tempPosition<currentPosition+10) return  clearInterval(timer);
      tempPosition=currentPosition;
      currentPosition -= 10
      if (currentPosition > 0) {
        document.body.scrollTop = document.documentElement.scrollTop = currentPosition
      } else {
        window.scrollTo(0, 0)
        clearInterval(timer)
      }
    }, 1)
  }

  return (
    <div className="layout-footer w-full h-[200px]">
       <ProCard style={{ marginBlockStart: 8,background:"rgba(0,0,0,0)" }} gutter={8}>
        <ProCard colSpan={{md: 8, lg: 8, xl: 8 }} layout="center" >
           <div className="text-white">
              <h2 className="text-xl mb-2">关于我们</h2>
              <ul style={{color:"rgba(255,255,255,0.6"}} className="flex flex-col wrap justify-evenly">
                <li><a>品牌故事</a></li>
                <li><a>品牌合作</a></li>
                <li><a>品牌保障</a></li>
              </ul>
           </div>
        </ProCard>
        <ProCard colSpan={{ md: 8, lg: 8, xl: 8 }} layout="center" >
          <div className="flex justify-start ">
            <img src={logo} className="w-[80px] h-[80px] inline-block " />
            <div className="flex-shrink-0 flex flex-col justify-center items-center w-26 pl-4 pr-4">
              <h1 className="text-4xl font-bold text-orange-400 tracking-wider">宠物商城</h1>
              <h3 className="text-2xl tracking-widest text-orange-400 text-opacity-80">Pet Mall</h3>
            </div>
          </div>
        </ProCard>
        <ProCard colSpan={{md: 8, lg: 8, xl: 8 }} layout="center" >
        <div className="text-white">
              <h2 className="text-xl mb-2">友情链接</h2>
              <ul style={{color:"rgba(255,255,255,0.6"}} className="flex flex-col wrap justify-evenly">
              <li><a>阿里巴巴集团</a></li>
              <li><a>淘宝网</a></li>
              <li><a>天猫</a></li>
            </ul>
          </div>
        </ProCard>
      </ProCard>
      <div style={{fontSize:"12px",color:"gray",textAlign:"center"}}>Design by ChenShen</div>
      <div className="my-to-top fixed bottom-20 right-4">
        <VerticalAlignTopOutlined className="active border rounded-full p-2" style={{fontSize: "40px"}}
         onClick={top}/></div>
    </div>
  )
})
