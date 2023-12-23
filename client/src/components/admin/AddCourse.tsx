import { ADD_COURSE } from '@/graphql/mutations';
import { GET_CATEGORIES } from '@/graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, Select, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
function AddCourse() {
  const [form] = Form.useForm();
  const { data } = useQuery(GET_CATEGORIES);
  const [addCourse] = useMutation(ADD_COURSE);
  const handleSubmit = async (values) => {
    try {
      await addCourse({
        variables: {
          course: values,
        },
      });
      message.success('Course created successfully');
      form.resetFields();
    } catch (e) {
      message.error(e.message);
    }
  };
  const categories = data?.categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  return (
    <div>
      <h2 className="text-2xl font-semibold pb-4">Add Course</h2>
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
          <TextArea />
        </Form.Item>
        <Form.Item label="Abstract" name="abstract">
          <TextArea />
        </Form.Item>
        <Form.Item label="Bibliography" name="bibliography">
          <TextArea />
        </Form.Item>
        <Form.Item label="Category" name="category" required>
          <Select options={categories} />
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

export default AddCourse;
