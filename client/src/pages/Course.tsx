import { About, Grades, Participants, Teachers } from '@/components/course';
import { GET_COURSE_BY_ID } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';

export default function Course() {
  const { id } = useParams();
  const { data, error, loading } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      id: parseInt(id ?? ''),
    },
  });

  const course = data?.course;
  return (
    <div className="course">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <>
          <h2 className="text-3xl">{course.name}</h2>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: 'Course',
                key: '1',
                children: <About info={course} />,
              },
              {
                label: 'Participants',
                key: '2',
                children: <Participants courseId={course.id} />,
                // disabled: getUserByEmail.role === 'student',
              },
              {
                label: 'Teachers',
                key: '3',
                children: <Teachers />,
              },
              {
                label: 'Grades',
                key: '4',
                children: <Grades />,
                // disabled: getUserByEmail.role === 'student',
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
