import {
  About,
  Classes,
  Participants,
  Teachers,
  Assignments,
} from '@/components/course';
import { GET_COURSE_BY_ID } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import Submissions from './Submissions';
import Resources from '@/components/course/Resources';

export default function Course() {
  const { id } = useParams();
  const curTab = (useParams()["*"] ?? 'About').toLowerCase();
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
          <h2 className="text-3xl font-semibold">{course.name}</h2>
          <Tabs
            onChange={(key) => { history.pushState({}, "", `/courses/${id}/${key}`) }}
            defaultActiveKey={curTab}
            items={[
              {
                label: 'About',
                key: 'about',
                children: <About info={course} />,
              },
              {
                label: 'Resources',
                key: 'resources',
                children: <Resources courseId={course.id} />,
              },
              {
                label: 'Classes',
                key: 'classes',
                children: <Classes courseInfo={course} />,
                // disabled: getUserByEmail.role === 'student',
              },
              {
                label: 'Participants',
                key: 'participants',
                children: <Participants courseId={course.id} />,
                // disabled: getUserByEmail.role === 'student',
              },
              {
                label: 'Teachers',
                key: 'teachers',
                children: <Teachers courseId={course.id} />,
              },
              {
                label: 'Assignments',
                key: 'assignments',
                children: <Assignments courseId={course.id} />,
                // disabled: getUserByEmail.role === 'student',
              },
              {
                label: 'Submissions',
                key: 'submissions',
                children: <Submissions courseId={course.id} />,
                // disabled: getUserByEmail.role === 'student',
              },
            ]}
          />
        </>
      )}
    </div>
  );
}
