import React, { useState,useMemo } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Cascader,
  Modal 
} from 'antd';
import options from '@/pages/Settle/cityData'
import {alipay} from '@/services/user/index'
const { TextArea } = Input;
type IProp={
    count:number;
    total:number;
    list:any;
}
const FormDisabledDemo = (props:IProp) => {
    const [form] = Form.useForm();
    const [formValues,setFormValues]=useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const freight=useMemo(()=>Math.ceil(Math.random()*9+11),[]);

    const onValuesChange=async (changeValue:any,values:any)=>{
        setFormValues(values);
    }
    const toBuy=async ()=>{
        await form.validateFields();
        showModal();
    }
    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk =async () => {
        let values=await form.validateFields();
        let list;
        if(!(props.list instanceof Array)) list=[props.list];
        else list=[...props.list];
        values.buyGoods=JSON.stringify(list);
        values.price=formValues?.deliveryMethod=="快运"?(+props.total+freight).toFixed(2):(+props.total).toFixed(2);
        values.freight=formValues?.deliveryMethod=="快运"?freight:0;
        let results=await alipay(values);
        window.location.href=results;
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
  return (
    <div className="w-[96%]">
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
      <div>
        <div className="leading-[45px] w-full bg-gray-200 pl-4 text-lg">配送至</div>
        <div className="mt-2 w-3/4 mx-auto">
            <Form.Item label="收货人"  name="deliveryName" rules={[{ required: true, message: '请输入收货人' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="收货手机号"  name="deliveryPhone" rules={[{ required: true, message: '请输入收货手机号' }]}>
            <Input />
            </Form.Item>

            <Form.Item label="收货地址" name="deliveryArea"  rules={[{ required: true, message: '请选择收货地址' }]}>
                <Cascader options={options}  placeholder="请选择收货地址" size="middle"/>
            </Form.Item>
        </div>
    </div>

      <div>
        <div className="leading-[45px] w-full bg-gray-200 pl-4 text-lg">配送方式及备注</div>
        <div className="mt-2 w-4/5 mx-auto">        
            <div className="text-md my-4">配送方式：</div>
            <Form.Item  name="deliveryMethod"  rules={[{ required: true, message: '请选择配送方式' }]}>
                <Radio.Group className='flex flex-col space-y-8'>
                    <Radio value="无需快递"> 无需快递 </Radio>
                    <Radio value="普通快递"> 普通快递 （无需付邮费，只用付商品本身费用即可）</Radio>
                    <Radio value="快运"> 快运（需付邮费） </Radio>
                </Radio.Group>
            </Form.Item>
            <div className="text-md my-4">备注：</div>    
            <Form.Item  name="remarks">
               <TextArea rows={4} placeholder="如有其他需求，可以在此进行说明。" />
            </Form.Item>
        </div>
      </div>
      <div className="header absolute top-0 right-[4%] w-[300px]">
        <div className="title iconfont icon-gouwuche text-base"> 核对订单</div>
        <div className="w-[80%] mx-auto space-y-2 my-2">
            <div>收货人：<span>{formValues?.deliveryName}</span></div>
            <div>收货手机号：<span>{formValues?.deliveryPhone}</span></div>
            <div>收货地址：<span>{formValues?.deliveryArea}</span></div>
            <div>配送方式：<span>{formValues?.deliveryMethod}</span></div>
            <div>备注：<span>{formValues?.remarks?formValues.remarks:"无"}</span></div>
            <div>商品总金额：￥<span>{(+props.total).toFixed(2)}</span></div>
            <div>数量：<span>{props.count}</span></div>
            <div>运费：￥<span>{formValues?.deliveryMethod=="快运"?freight:0}</span></div>
            <div className="text-red-500 text-xl">订单总金额：￥<span>{formValues?.deliveryMethod=="快运"?(+props.total+freight).toFixed(2):(+props.total).toFixed(2)}</span></div>
            <button className="w-full py-2 bg-orange-600 rounded-md text-white" onClick={toBuy}>结算</button>
        </div>
      </div>
      </Form>
      <Modal title="温馨提示" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>即将跳转支付界面，是否准备结算？</p>
      </Modal>
    </div>
  );
};

export default FormDisabledDemo;