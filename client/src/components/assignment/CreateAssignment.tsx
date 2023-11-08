import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Space, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useMutation } from '@apollo/client';
import { ADD_ASSIGNMENT } from '@/graphql/mutations';
import { useRef } from 'react';

dayjs.extend(customParseFormat);

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

export default function CreateAssignment({ courseId }) {
  const [addAssignment] = useMutation(ADD_ASSIGNMENT);
  const datetimeRef = useRef(null);
  const handleSubmit = async (values) => {
    if (
      (values?.essay?.length ?? 0) + (values?.multipleChoice?.length ?? 0) <
      1
    ) {
      message.warning('At least one question is required!');
      return;
    }
    if (!values['deadline']) {
      datetimeRef.current.focus();
      return;
    }
    const questions = (
      values?.multipleChoice?.map((item) => ({
        question: item['question'],
        options: [
          {
            text: item['option-1'],
            is_correct: true,
          },
          {
            text: item['option-2'],
            is_correct: false,
          },
          {
            text: item['option-3'],
            is_correct: false,
          },
          {
            text: item['option-4'],
            is_correct: false,
          },
        ],
        type: 'multiple_choice',
      })) ?? []
    ).concat(
      !values.essay
        ? []
        : values.essay.map((essay) => ({ ...essay, type: 'essay' }))
    );
    const data = await addAssignment({
      variables: {
        assignmentInfo: {
          questions,
          name: values['name'],
          deadline: values['deadline'].format('YYYY-MM-DD'),
          course_id: parseInt(courseId),
        },
      },
    });
    if (data.data) {
      message.success('Assignment created successfully.');
    }
  };
  return (
    <Space direction="vertical" size={12}>
      <h3 className="text-2xl">Create Assignment</h3>
      <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
        <div className="flex gap-4">
          <Form.Item label="Assignment Title" name="name" required={true}>
            <Input required />
          </Form.Item>
          <Form.Item label="Deadline" name="deadline" required={true}>
            <DatePicker
              ref={datetimeRef}
              picker="date"
              disabledDate={disabledDate}
            />
          </Form.Item>
        </div>
        <Form.List name="essay">
          {(fields, { add, remove }, { errors }) => (
            <div>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'question']}
                    rules={[
                      { required: true, message: 'Missing Essay Question.' },
                    ]}
                  >
                    <Input placeholder="Essay Question" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add Essay Question
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </div>
          )}
        </Form.List>
        <div className="border-2"></div>
        <Form.List name="multipleChoice">
          {(fields, { add, remove }, { errors }) => (
            <div>
              <p className="text-xs py-2">
                * Green border indicates the correct answer field
              </p>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="flex flex-col " align="baseline">
                  <div className="flex items-baseline gap-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'question']}
                      rules={[
                        { required: true, message: 'Missing MCQ Question' },
                      ]}
                    >
                      <Input placeholder="MCQ Question" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                  <div className="flex gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'option-1']}
                      rules={[{ required: true, message: 'Missing option ' }]}
                    >
                      <Input
                        placeholder="Option"
                        className="border-green-500 hover:border-green-300 focus:border-green-300"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option-2']}
                      rules={[{ required: true, message: 'Missing option ' }]}
                    >
                      <Input placeholder="Option" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option-3']}
                      rules={[{ required: true, message: 'Missing option ' }]}
                    >
                      <Input placeholder="Option" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'option-4']}
                      rules={[{ required: true, message: 'Missing option ' }]}
                    >
                      <Input placeholder="Option" />
                    </Form.Item>
                  </div>
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add MCQ
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </div>
          )}
        </Form.List>
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
