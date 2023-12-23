import { ADD_CATEGORY } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message } from 'antd';

function AddCategory() {
  const [form] = Form.useForm();
  const [addCategory] = useMutation(ADD_CATEGORY);
  const handleSubmit = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    try {
      await addCategory({
        variables: {
          name,
          description,
        },
      });
      message.success('Category created successfully');
      form.resetFields();
    } catch (e) {
      console.log(e);
      message.error(e.message);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold pb-4">Add Category</h2>
      <Form
        className=" m-auto"
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item label="Name" name="name" required={true}>
          <Input required />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="bg-blue-400 text-white my-2"
            block
            size="large"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddCategory;
