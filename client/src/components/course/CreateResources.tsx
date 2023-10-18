import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Space, message } from 'antd';
import { useMutation } from '@apollo/client';
import { SUBMIT_RESOURCES } from '@/graphql/mutations';
import { useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';

export default function CreateResources({ courseId, refetchResources }) {
  const [submitResources] = useMutation(SUBMIT_RESOURCES);
  const formRef = useRef<FormInstance>(null);

  const handleSubmit = async (values) => {
    if (!values?.resources?.length) {
      message.warning('At least one resource must be added.');
      return;
    }
    try {
      const data = await submitResources({
        variables: {
          resources: {
            resources: values.resources,
            course_id: courseId,
          },
        },
      });
      if (data?.data?.submitResources) {
        message.success('Resources Submitted Successfully');
        refetchResources();
        formRef?.current?.resetFields();
      } else {
        message.error('Failed to submit resources');
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <Space direction="vertical" className="w-full">
      <h3 className="text-2xl">Create Resource</h3>
      <Form
        className=" m-auto"
        layout="vertical"
        onFinish={handleSubmit}
        ref={formRef}
      >
        <div className="flex gap-4"></div>
        <Form.List name="resources">
          {(fields, { add, remove }, { errors }) => (
            <div className="">
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  className="flex flex-col items-start  w-full items-stretch"
                >
                  <div className="flex gap-4 ">
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[{ required: true, message: 'Missing Title' }]}
                      label="Resource Title"
                      required={true}
                      className=""
                    >
                      <Input
                        required
                        size="large"
                        placeholder="Enter title"
                        className="lg:w-[30vw] md:w-[50vw] sm:w-[70vw]"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                  <Form.Item
                    {...restField}
                    label="Description"
                    name={[name, 'description']}
                    className="w-[80%]"
                    rules={[{ required: true, message: 'Missing Description' }]}
                  >
                    <TextArea
                      placeholder="Enter Description"
                      size="large"
                      rows={4}
                    />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add Resouce
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </div>
          )}
        </Form.List>
        <div className="border-2"></div>
        <Form.Item className="w-2/6">
          <Button
            type="primary"
            className="bg-blue-400 text-white my-2 "
            block
            size="large"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
