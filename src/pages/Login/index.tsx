import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import {  Divider, message, Result, Space, Tabs } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { CSSProperties } from 'react';
import { useState,useRef} from 'react';
import logo from '@/assets/images/logo.png'
import backgroundImg from'@/assets/images/login-register-background.jpg'
import backgroundAll from '@/assets/images/background.png'
import { useNavigate,request,useModel } from '@umijs/max';
import md5 from 'js-md5'
import {setToken} from '@/models/global'
import {queryGetUserInfo,queryGetCartList} from '@/services/user'
import  './index.less';

type LoginType = 'phone' | 'account' | 'resetPassword';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const {setUserInfo}=useModel("global");
  const {setCart}=useModel('cart') as any;
  const items1 = [
    { label: '账号密码登录', key: 'account',  }, 
    { label: '手机号登录', key: 'phone', },
];
  const items2=[
    { label:"重置密码",key:'resetPassword'}
  ]
let navigate=useNavigate();
  const  noLoginMethod=()=>{
    message.warning("暂未接入该登录方式");
  }
const formRef = useRef<ProFormInstance>();
const [loading,setLoading]=useState(false);
const validateAndGetFormatValue = async () => {
  let result:any;
  setLoading(true);
    formRef.current?.validateFieldsReturnFormatValue?.().then(async (values) => {
      try{
      if(loginType !== 'resetPassword'){
        if(values.phone){
          result=await request(`/api/notoken/mobileLogin`,{
            method:"POST",
            data:values
          })
          if(result.code !=200) return message.error(result.message);
          result.data.describ="user"
        }else{
          values.describ="user";
          values.password=md5(values.password);
        }
        result=await request(`/api/notoken/login`,{
          method:"POST",
          data:values.phone?result.data:values
        })
        if(result.code !=200) return message.error(result.message);
        setToken(result.data);
        message.success(result.message);
        let {data}=await queryGetUserInfo(result.data);
        setUserInfo(data);
        data=await queryGetCartList();
        setCart(data.data);
        setTimeout(()=>{
          navigate('/user',{replace:true});
        },500);
      }else{
        result= await request(`/api/notoken/resetpassword`,{
          method:"POST",
          data:values
        })
        if(result.code !=200) return message.error(result.message);
        message.success(result.data);

        setTimeout(()=>{
          setLoginType("account");
        },500);
      }
    }catch(err){console.log(err)}
    finally{setLoading(false)}
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
          searchConfig: { submitText: loginType !== 'resetPassword'?'登 录':'重置密码'},
          submitButtonProps:{
            style:{
              width:"100%"
            },
            loading
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
            <img className="w-11/12 opacity-40 absolute " src={backgroundImg}/>
          ),
        }}
        actions={
          loginType !== 'resetPassword'?<div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Divider plain>
              <span style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}>
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid #D4D8DD',
                  borderRadius: '50%',
                }}
              >
                <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} onClick={noLoginMethod}/>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid #D4D8DD',
                  borderRadius: '50%',
                }}
              >
                <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} onClick={noLoginMethod}/>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid #D4D8DD',
                  borderRadius: '50%',
                }}
              >
                <WeiboOutlined style={{ ...iconStyles, color: '#333333' }} onClick={noLoginMethod}/>
              </div>
            </Space>
          </div>:<div></div>
        }
        onFinish={validateAndGetFormatValue}
      >
        {loginType !== 'resetPassword'?<Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={items1}
        />:<Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={items2}
          />
        }
        {loginType === 'account' && (
          <>
            <ProFormText
              name="account"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'账号:'}
              rules={[
                {
                  required: true,
                  message: '请输入账号!',
                },
              ]}
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
        {loginType === 'phone' && (
          <>
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
                let {phone}=await formRef.current?.validateFields(['phone']);
                let {data,code}=await request(`/api/notoken/getTestCode`,{
                  method:"POST",
                  data:{phone,type:'login'}
                })
                if(+code===200)
                  message.success(`获取验证码成功！验证码为：${data}`);
                else if(+code===202) message.error("手机号不存在！");
              }}
            />
          </>
        )}
         {loginType === 'resetPassword' && (
          <>
           <ProFormText
              name="account"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'账号:'}
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
                let {data,code,message:msg}=await request(`/api/notoken/getTestCode`,{
                  method:"POST",
                  data:{account,phone,type:'reset'}
                })
                if(+code===200)
                  message.success(`获取验证码成功！验证码为：${data}`);
                else if(+code===202) message.error(msg);
              }}
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
             没有账号？<span className="text-blue-600"  onClick={()=>navigate("/register",{replace:true})}>注册</span>
          </div>
          {loginType !== 'resetPassword'?<a
            style={{
              float: 'left',
            }}
            onClick={()=>{setLoginType('resetPassword')}}
          >
            忘记密码？
          </a>:
          <a
          style={{
            float: 'left',
          }}
          onClick={()=>{setLoginType('account')}}
        >
           使用账号密码登录
        </a>
          }
        </div>
      </LoginFormPage>
    </div>
  );
};

