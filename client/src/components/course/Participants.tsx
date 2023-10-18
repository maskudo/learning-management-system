import { GET_ENROLLMENTS_BY_COURSE } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
];

export default function Participants({ courseId }) {
  const { data, error, loading } = useQuery(GET_ENROLLMENTS_BY_COURSE, {
    variables: {
      courseId,
    },
  });

  const users = data?.getEnrollmentsByCourse?.map((res) => ({
    ...res.student,
    key: res.id,
  }));
  return (
    <div className="participants">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          <Table columns={columns} dataSource={users} />
        </div>
      )}
    </div>
  );
}
