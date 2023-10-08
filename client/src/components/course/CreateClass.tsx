import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Button, DatePicker, Form, Input, Space, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useRef } from 'react';
import { ADD_CLASS } from '@/graphql/mutations';
import { useApolloClient, useMutation } from '@apollo/client';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};

export default function CreateClass({ courseId, teacherId }) {
  const ref = useRef(null);
  const [addClass] = useMutation(ADD_CLASS);
  const client = useApolloClient();
  const handleSubmit = async (values) => {
    if (!values.datetime) {
      ref?.current?.focus();
      return;
    }
    const start_time = values.datetime[0].toISOString();
    const end_time = values.datetime[1].toISOString();
    const title = values.title;
    try {
      const { errors } = await addClass({
        variables: {
          classInfo: {
            title,
            start_time,
            end_time,
            course_id: courseId,
            teacher_id: teacherId,
          },
        },
      });
      if (errors) {
        throw new Error('Error creating class');
      } else {
        message.success('Course created successfully!');
        client.refetchQueries({
          include: ['getClassesByCourse'],
        });
      }
    } catch (e) {
      message.error(
        'An error occured while creating class. Please try again later.'
      );
    }
  };
  return (
    <Space direction="vertical" size={12}>
      <h3 className="text-2xl">Create Class</h3>
      <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
        <div className="flex gap-4">
          <Form.Item label="Class Title" name="title" required={true}>
            <Input required />
          </Form.Item>
          <Form.Item
            label="Start Time - End Time"
            name="datetime"
            required={true}
          >
            <RangePicker
              className="w-full"
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
              ref={ref}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  dayjs('00:00:00', 'HH:mm:ss'),
                  dayjs('11:59:59', 'HH:mm:ss'),
                ],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </div>
        <Form.Item className="w-2/6">
          <Button
            type="primary"
            className="bg-blue-400 text-white my-2 "
            // styles={{ color: 'white' }}
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
