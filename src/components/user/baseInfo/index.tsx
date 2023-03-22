import React from 'react';
import { useModel } from '@umijs/max'
import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const App: React.FC = () => {
    const {userInfo} = useModel("global");

    return (<>
      <div className="w-[80%] ">
          <div className="ml-4 text-xl leading-[45px] bg-gray-200  pl-4">修改密码</div>
          <div className="mt-12">
            <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                    label="昵称"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="账号"
                    name="account"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="手机号"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input  disabled value={userInfo.phone}/>
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
          </div>
      </div>
</>

)};

export default App;