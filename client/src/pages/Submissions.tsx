import { GET_SUBMITTED_ASSIGNMENTS_BY_COURSE } from '@/graphql/query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Table } from 'antd';

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
    title: 'Link',
    dataIndex: 'id',
    render: (text: string) => <Link to={`submissions/${text}`}>Link</Link>,
  },
];

export default function Submissions({ courseId }) {
  const { data, error, loading } = useQuery(
    GET_SUBMITTED_ASSIGNMENTS_BY_COURSE,
    {
      variables: {
        courseId,
      },
    }
  );
  const assignments = data?.getSubmittedAssignmentsByCourse?.map((item) => ({
    assignment: item?.assignment?.name,
    student: item?.student?.name,
    id: item?.id,
    key: item?.id,
  }));
  console.log(assignments);

  return (
    <div className="submissions">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      <Table columns={columns} dataSource={assignments} />
    </div>
  );
}
