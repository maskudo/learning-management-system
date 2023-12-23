import { ADD_COURSE_TEACHER } from '@/graphql/mutations';
import { GET_AVAILABLE_TEACHERS_BY_COURSE } from '@/graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Select, message } from 'antd';
import { useParams } from 'react-router-dom';
function AddCourseTeacher() {
  const [form] = Form.useForm();
  const { id } = useParams();
  const courseId = parseInt(id);
  const { data, refetch } = useQuery(GET_AVAILABLE_TEACHERS_BY_COURSE, {
    variables: {
      courseId,
    },
    fetchPolicy: 'network-only',
  });
  const [addCourseTeacher] = useMutation(ADD_COURSE_TEACHER);
  const teachers =
    data?.getAvailableTeachersByCourse?.map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    })) ?? [];
  const handleSubmit = async ({ teacher }: { teacher: Number }) => {
    try {
      await addCourseTeacher({
        variables: {
          courseId,
          teacherId: teacher,
        },
      });
      message.success('Teacher added successfully');
      form.resetFields();
      refetch({ courseId });
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold pb-4">Add Course Teacher</h2>
      <Form
        className=" m-auto"
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item label="Teacher" name="teacher" required>
          <Select options={teachers} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="bg-blue-400 text-white my-2"
            block
            size="large"
            htmlType="submit"
          >
            Add Teacher
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddCourseTeacher;
