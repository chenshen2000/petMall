import React,{memo,useRef} from 'react';
import  './index.less';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import guodu from '@/assets/images/guodu.jpg'

export default memo(function Page() {
  const formRef=useRef() as any;
  return (
    <div style={{background: "#F5F5F5"}}>
      <div className="w-11/12 mx-auto mt-4 my-feedback">
        <div><img src={guodu} className="w-full"/></div>
        <h1 className="text-3xl text-center my-12">联系我们</h1>
        <div className="pb-8">
        <ProForm
              className="inline-block"
              formRef={formRef}
              submitter={{
                render: (_, dom) => <button className="my-button">提交</button>,

              }}
              onFinish={async () => {
                formRef.current?.validateFieldsReturnFormatValue?.().then(async (values:any) => {
                  console.log(values);
                })
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="name"
                  label="姓名："
                  placeholder="请输入姓名"
                  rules={[
                    {
                      required: true,
                      message: '请输入姓名!',
                    },
                  ]}
                />
                <ProFormSelect
                  options={[
                    {
                      value: 'goods',
                      label: '商品问题',
                    },
                    {
                      value: 'service',
                      label: '售后问题',
                    },
                    {
                      value: 'Bug',
                      label: '网站Bug问题',
                    },
                    {
                      value: 'other',
                      label: '其他',
                    },
                  ]}
                  rules={[
                    {
                      required: true,
                      message: '请选择类型!',
                    },
                  ]}
                  width="xs"
                  name="type"
                  label="反馈类型"
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="xl"
                  name="phone"
                  label="电话："
                  placeholder="请输入电话"
                  rules={[
                    {
                      required: true,
                      message: '请输入电话!',
                    },
                  ]}
                />
              </ProForm.Group>
              <ProForm.Group>
                  <ProFormText
                    width="xl"
                    name="email"
                    label="邮箱："
                    placeholder="请输入邮箱"
                    rules={[
                      {
                        required: true,
                        message: '请输入邮箱!',
                      },
                    ]}
                  />
              </ProForm.Group>  
              <ProFormTextArea width="xl" label="留言:" name="remark" placeholder="请在此处详细描述反馈问题."/>
            </ProForm>
        </div>
      </div>
    </div>
  );
})
