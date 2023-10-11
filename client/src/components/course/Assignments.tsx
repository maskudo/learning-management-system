import { GET_ASSIGNMENTS_BY_COURSE } from '@/graphql/query';
import dayjs from 'dayjs';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/context/userContext';
import CreateAssignment from '../assignment/CreateAssignment';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Deadline',
    dataIndex: 'deadline',
    render: (text: string) => <div>{dayjs(text).format('LLLL')}</div>,
  },
  {
    title: 'Link',
    dataIndex: 'id',
    render: (id: number) => (
      <Link className="text-blue-400" to={`assignment/${id}`}>
        Link
      </Link>
    ),
  },
];

export default function Assignments({ courseId }) {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_ASSIGNMENTS_BY_COURSE, {
    variables: {
      courseId,
    },
  });
  const assignments =
    data?.getAssignmentsByCourse?.map((elem) => ({ ...elem, key: elem.id })) ??
    [];

  return (
    <div className="participants">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          {user?.role && <CreateAssignment courseId={courseId} />}
          {!assignments?.length ? (
            <div>No Assignments yet...</div>
          ) : (
            <Table columns={columns} dataSource={assignments} />
          )}
        </div>
      )}
    </div>
  );
}
