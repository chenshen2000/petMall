import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import {  message, Tabs } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { CSSProperties } from 'react';
import { useState,useRef } from 'react';
import logo from '@/assets/images/logo.png'
import backgroundImg from'@/assets/images/login-register-background.jpg'
import backgroundAll from '@/assets/images/background.png'
import md5 from 'js-md5'
import { useNavigate,request } from '@umijs/max';

import  './index.less';
type LoginType = 'register';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('register');
  const items = [
    { label: '用户注册', key: 'register',  }, 
];
const [loading,setLoading]=useState(false);
let navigate=useNavigate();
const formRef = useRef<ProFormInstance>();
const validateAndGetFormatValue = async () => {
  formRef.current?.validateFieldsReturnFormatValue?.().then(async (values) => {
    try{
      values.describ="user";
      values.password=md5(values.password);
      let {data}=await request(`/api/notoken/register`,{
        method:"POST",
        data:values
      })
      message.success(data);
      setTimeout(()=>{
        navigate('/login',{replace:true})
      },500);
    }catch(err){console.log(err)}
    finally{  setLoading(false);}
  });
};

  return (
    <div style={{ backgroundColor: 'white', width:"100%",height: '100vh', margin: -24 ,overflow:"hidden"}}>
      <LoginFormPage
        formRef={formRef}
        backgroundImageUrl={backgroundAll}
        logo={logo}
        title="宠物商城"
        subTitle="一站式宠物用品商城"
        submitter={{
          searchConfig: { submitText: '注  册',},
          submitButtonProps:{
            style:{
              width:"100%"
            }
          }
        }}
        activityConfig={{
          style: {
            borderRadius: 8,
            width: "100%",
            height: "100%",
            position:"relative"
          },
          action: (
            <img className="w-11/12 opacity-40 absolute md:inline-block hidden" src={backgroundImg}/>
          ),
        }}
        onFinish={validateAndGetFormatValue}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={items}
        />
        {loginType === 'register' && (
          <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'账号'}
                rules={[
                  {
                    required: true,
                    message: '请输入账号!',
                  },
                ]}
              />
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={'prefixIcon'} />,
                  }}
                  name="phone"
                  placeholder={'手机号'}
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /\d{5,11}/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`;
                    }
                    return '获取验证码';
                  }}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    let {phone,account}=await formRef.current?.validateFields(['phone','account']);
                    let {data,code}=await request(`/api/notoken/getTestCode`,{
                      method:"POST",
                      data:{phone,account,type:'register'}
                    })
                    if(code == 200)
                      message.success(`获取验证码成功！验证码为：${data}`);
                    else message.error(data);
                  }}
                />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码: '}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <div
            style={{
              float: 'right',
              paddingBottom:"10px",
              paddingRight:"6px",
              cursor:"pointer"
            }}
          >
             已有账号？<span className="text-blue-600"  onClick={()=>navigate("/login",{replace:true})}>登录</span>
          </div>
        </div>
      </LoginFormPage>
    </div>
  );
};

