import React,{memo,useEffect,useState} from 'react';
import  './index.less';
import Breadcrumb from '@/components/breadCrumb';
import withAuth from "@/hocs/withAuth";
import {useModel,useSearchParams,useNavigate} from '@umijs/max'
import BaseInfo from '@/components/user/baseInfo'
import MyOrder from '@/components/user/myOrder'
import ResetPassword from '@/components/user/resetPassword'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
    IdcardOutlined,
    KeyOutlined

  } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Base from 'antd/es/typography/Base';

const { Header, Content, Footer, Sider } = Layout;

export default withAuth(memo(function Page() {
  let {userInfo}=useModel("global");
  const navigate=useNavigate();
  let [searchParams]=useSearchParams();
  let menu=['基本信息','我的订单','修改密码']
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb,setBreadcrumb]=useState<string[]>([]);
  const [tab,setTab]=useState<string[]>([String(searchParams.get("key"))]);
  
  //添加面包屑
  const push=()=>{
    return breadcrumb.map((item:any)=>{
      return {
        path:"/user?key=1",
        title:item
      }
    })
  }
  useEffect(()=>{
    if(tab[0] == "null") navigate("/",{replace:true});
    else {
      setBreadcrumb([menu[(+tab[0])-1]])
    }
  },[])
  
  useEffect(()=>{
    let tab=window.location.search.substr(-1,1);
    setTab([tab]);
  },[window.location.href]);

  return (
    <div className="my-user">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null} collapsible collapsed={collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            className="mt-16"
            defaultSelectedKeys={["1"]}
            selectedKeys={tab}
            items={[IdcardOutlined,UnorderedListOutlined,KeyOutlined].map(
              (icon, index) => ({
                key: String(index + 1),
                icon: React.createElement(icon),
                label: menu[index],
              }),
            ) as any} 
            onClick={(item)=>{
              setBreadcrumb([menu[(+item.key)-1]]);
              history.replaceState("","","/user?key="+item.key)
            }}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="flex items-center">
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger ml-2',
                    style:{fontSize:"20px"},
                    onClick: () => setCollapsed(!collapsed),
                })}
                <div className="ml-6 my-user-breadcrumb">
                  <Breadcrumb items={[{path:"/user?key=1",title:"个人中心"},...push()]}  />
                </div>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            {tab[0]=="1" && <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
              <BaseInfo /></div>}
            {tab[0]=="2" && <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
              <MyOrder /></div>}
            {tab[0]=="3" && <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
              <ResetPassword /></div>}
          </Content>
        </Layout>
    </Layout>
  </div>
  );
}))
