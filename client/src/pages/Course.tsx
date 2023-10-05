import { GET_COURSE_BY_ID, GET_USER_BY_EMAIL } from '@/graphql/query';
import { useApolloClient, useQuery } from '@apollo/client';
import { getQueryDefinition } from '@apollo/client/utilities';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';

export default function Course() {
  const { id } = useParams();
  const { data, error, loading } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      id: parseInt(id ?? ''),
    },
  });
  const email = localStorage.getItem('email');
  const client = useApolloClient();
  const { getUserByEmail } = client.readQuery({
    query: GET_USER_BY_EMAIL,
    variables: {
      email,
    },
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  const course = data.course;
  return (
    <div className="course">
      <h2 className="text-2xl">{course.name}</h2>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: 'Course',
            key: '1',
            children: 'Tab 1',
          },
          {
            label: 'Participants',
            key: '2',
            children: 'Tab 2',
            disabled: getUserByEmail.role === 'student',
          },
          {
            label: 'Teachers',
            key: '3',
            children: 'Tab 3',
          },
          {
            label: 'Grades',
            key: '4',
            children: 'Tab 4',
            disabled: getUserByEmail.role === 'student',
          },
        ]}
      />
    </div>
  );
}
