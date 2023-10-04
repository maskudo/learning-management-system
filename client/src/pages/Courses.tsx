import Course from '@/components/common/Course';
import { GET_COURSES } from '@/graphql/query';
import { useQuery } from '@apollo/client';

export default function Courses() {
  const { loading, error, data } = useQuery(GET_COURSES);
  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;
  return (
    <div className="courses">
      {data.courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
}
