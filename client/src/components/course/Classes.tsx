import { GET_CLASSES_BY_COURSE } from '@/graphql/query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { useQuery } from '@apollo/client';
import { CreateClass } from '.';
import { Table } from 'antd';
import { useUserContext } from '@/context/userContext';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text: string, record) => (
      <Link
        to={`class/${record.id}`}
        className="capitalize underline underline-offset-2"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Teacher',
    dataIndex: 'teacher',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Start Time',
    dataIndex: 'start_time',
    render: (text: string) => <div>{dayjs(text).format('LLLL')}</div>,
  },
  {
    title: 'End Time',
    dataIndex: 'end_time',
    render: (text: string) => <div>{dayjs(text).format('LLLL')}</div>,
  },
];

export default function Classes({ courseInfo }) {
  const { user } = useUserContext();
  const isTeachingThisCourse = !!user?.teaching?.find(
    (elem) => elem.course.id === courseInfo.id
  );
  const { data, error, loading } = useQuery(GET_CLASSES_BY_COURSE, {
    variables: {
      courseId: courseInfo.id,
    },
  });
  const classes =
    data?.getClassesByCourse.map((classInfo) => ({
      ...classInfo,
      teacher: classInfo?.teacher?.name,
      key: classInfo.id,
    })) ?? [];

  return (
    <div className="classes">
      {isTeachingThisCourse && (
        <CreateClass courseId={courseInfo.id} teacherId={user.id} />
      )}
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          <Table columns={columns} dataSource={classes} />
        </div>
      )}
    </div>
  );
}
