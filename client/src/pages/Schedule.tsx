import { useUserContext } from '@/context/userContext';
import { GET_CLASSES_BY_USER } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { Table } from 'antd';

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Course',
    dataIndex: 'course',
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

export default function Schedule() {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_CLASSES_BY_USER, {
    variables: {
      userId: user?.id,
    },
  });
  const classes = data?.getClassesByUser.map((cls) => ({
    ...cls,
    key: cls.id,
    course: cls.course.name,
  }));
  return (
    <div className="schedule">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          <h2 className="text-2xl">Upcoming Classes</h2>
          <div className="classes">
            <div>
              {!classes?.length ? (
                <div> No classes yet</div>
              ) : (
                <Table columns={columns} dataSource={classes} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
