import { GET_CLASSES_BY_COURSE, GET_USER_BY_EMAIL } from '@/graphql/query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { CreateClass } from '.';
import { Table } from 'antd';

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text: string) => <div className="capitalize">{text}</div>,
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
  const client = useApolloClient();
  const email = localStorage.getItem('email');
  const user = client.readQuery({
    query: GET_USER_BY_EMAIL,
    variables: {
      email,
    },
  })?.getUserByEmail;
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
          <h3 className="text-2xl">All Classes</h3>
          {!classes?.length ? (
            <div> No classes yet</div>
          ) : (
            <Table columns={columns} dataSource={classes} />
          )}
        </div>
      )}
    </div>
  );
}
