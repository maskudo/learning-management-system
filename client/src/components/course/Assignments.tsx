import dayjs from 'dayjs';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/context/userContext';
import CreateAssignment from '../assignment/CreateAssignment';
import useAssignmentsQuery from '@/hooks/useAssignmentsQuery';
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
  const { data, error, loading } = useAssignmentsQuery();
  let assignments = data?.filter(
    (assignment) => assignment?.course?.id === courseId
  );
  assignments =
    assignments?.map((elem) => ({
      ...elem,
      key: elem.id,
    })) ?? [];
  const isTeachingThisCourse = !!user?.teaching?.find(
    (item) => item.course.id === courseId
  );
  return (
    <div className="participants">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          {isTeachingThisCourse && <CreateAssignment courseId={courseId} />}
          {!isTeachingThisCourse && (
            <Table columns={columns} dataSource={assignments} />
          )}
        </div>
      )}
    </div>
  );
}
