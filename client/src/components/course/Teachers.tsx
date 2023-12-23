import { GET_TEACHERS_BY_COURSE } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import AddCourseTeacher from './AddCourseTeacher';
import { useUserContext } from '@/context/userContext';

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

export default function Teachers({ courseId }) {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_TEACHERS_BY_COURSE, {
    variables: {
      courseId,
    },
    fetchPolicy: 'no-cache',
  });

  const users =
    data?.getTeachersByCourse.map((res) => ({
      ...res?.teacher,
      key: res?.teacher.id,
    })) ?? [];
  return (
    <div className="teachers">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          {user?.role === 'admin' && <AddCourseTeacher />}
          <Table columns={columns} dataSource={users} />
        </div>
      )}
    </div>
  );
}
