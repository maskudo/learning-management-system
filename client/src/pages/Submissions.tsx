import { GET_SUBMITTED_ASSIGNMENTS_BY_COURSE } from '@/graphql/query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { useUserContext } from '@/context/userContext';

const columns = [
  {
    title: 'Assignment',
    dataIndex: 'assignment',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Student',
    dataIndex: 'student',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Link',
    dataIndex: 'id',
    render: (text: string) => <Link to={`submissions/${text}`}>Link</Link>,
  },
];

export default function Submissions({ courseId }) {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(
    GET_SUBMITTED_ASSIGNMENTS_BY_COURSE,
    {
      variables: {
        courseId,
      },
      fetchPolicy: 'network-only',
    }
  );
  let assignments = data?.getSubmittedAssignmentsByCourse?.map((item) => ({
    assignment: item?.assignment?.name,
    student: item?.student?.name,
    id: item?.id,
    grade: item?.grade?.grade ?? '-',
    key: item?.id,
  }));
  const teachingCourses = user?.teaching?.map((course) => course.course.id);
  const isTeachingThisCourse = teachingCourses?.includes(parseInt(courseId));
  if (!isTeachingThisCourse) {
    assignments = assignments?.filter(
      (assignment) => assignment?.student === user?.name
    );
  }
  return (
    <div className="submissions">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      <Table columns={columns} dataSource={assignments} />
    </div>
  );
}
