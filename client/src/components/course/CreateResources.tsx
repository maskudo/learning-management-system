import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  FormInstance,
  Input,
  Space,
  Upload,
  message,
} from 'antd';
import { useMutation } from '@apollo/client';
import { SUBMIT_RESOURCES, UPLOAD_RESOURCES } from '@/graphql/mutations';
import { useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { FaUpload, FaXmark } from 'react-icons/fa6';

export default function CreateResources({ courseId, refetchResources }) {
  const [submitResources] = useMutation(SUBMIT_RESOURCES);
  const formRef = useRef<FormInstance>(null);

  const handleSubmit = async (values) => {
    if (!values?.resources?.length) {
      message.warning('At least one resource must be added.');
      return;
    }
    console.log(values);
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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Space direction="vertical" className="w-full">
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
                  className="flex flex-col w-full items-stretch p-4 border border-gray-200 rounded-lg mb-2 relative"
                >
                  <FaXmark
                    onClick={() => remove(name)}
                    className="absolute right-4 w-6 h-6 hover:text-red-600 text-red-400"
                  />
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
                  <Form.Item label="Files">
                    <Form.Item
                      {...restField}
                      name={[name, 'files']}
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      noStyle
                    >
                      <Upload
                        name="files"
                        accept=".pdf"
                        onChange={() => {}}
                        maxItems={3}
                      >
                        <Button icon={<FaUpload />}>Upload attachments</Button>
                      </Upload>
                    </Form.Item>
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
