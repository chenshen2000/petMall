import type { FC } from 'react'
import {useState} from 'react'
import { request,useModel,useNavigate} from '@umijs/max';
import { Progress, Form, Row, Col,Button,Modal } from 'antd';
import { ProFormText } from '@ant-design/pro-components'; 
import zxcvbn from 'zxcvbn'; // 密码强度校验
import md5 from 'js-md5'
import styles from './index.less'
const StrengthMeter: FC = () => {
  const {resetData}=useModel("global");
  const {setCart}=useModel("cart");
  const navigate=useNavigate();
  // 获取上下文 form 实例
  const [form] = Form.useForm();
  // 监听密码的改变
  const password = Form.useWatch('password', form);

  const watchStrength = (password: string): number => {
    const analysisValue = zxcvbn(password)
    // score得分只有0~4，且只有整数范围并没有小数
    return (analysisValue.score + 1) * 20
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk =async () => {
    await request("/api/setPassword",{
        method:"POST",
        data:{passwordNew:md5(password)}
    });
    resetData();
    setCart([]);
    navigate("/",{replace:true});
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish=(values:any)=>{
        showModal();
  }

  return (
    <div className="w-[80%] ">
        <div className="ml-4 text-xl leading-[45px] bg-gray-200  pl-4">修改密码</div>
        <div className="w-[60%] mx-auto mt-16">
            <Form form={form} onFinish={onFinish}>
            {/* 密码 */}
            <ProFormText.Password
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (value.length>=6) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error("密码不能小于六位！"));
                    },
                })
            ]}
            />
            {/* 确认密码 */}
            <ProFormText.Password
                label="确认密码"
                name="confirmPassword"
                fieldProps={{ visibilityToggle: false }}
                rules={[
                { required: true, message: "请输入确认密码" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次密码输入不一致"));
                    },
                })
                ]}
            />
            {/* 显示密码强度 */}
            <div className={styles['process-steps']}>
                <Progress
                    percent={password ? watchStrength(password) : 0}
                    steps={5}
                    strokeColor={['#e74242', '#EFBD47', '#ffa500', '#1bbf1b', '#008000']}
                    showInfo={false}
                />
            </div>
            <Row justify="space-around" className={styles['process-steps']}>
                {
                ['非常弱', '弱', '一般', '强', '非常强'].map(value => <Col span={4} key={value}>{value}</Col>)
                }
            </Row>
            <div className="text-center py-8">
                <Button type="primary" htmlType="submit">
                        确定修改
                </Button>
            </div>
        </Form>
        </div>
        <Modal title="温馨提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="确定修改">
            <p>是否确定修改？</p>
        </Modal>
    </div>
  )
}
export default StrengthMeter