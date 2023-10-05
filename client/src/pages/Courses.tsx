import CourseCard from '@/components/common/CourseCard';
import { GET_COURSES } from '@/graphql/query';
import { useQuery } from '@apollo/client';

export default function Courses() {
  const { loading, error, data } = useQuery(GET_COURSES);
  if (loading) return 'Loading...';

  if (error) return `Error! ${error.message}`;
  return (
    <div className="courses-container">
      <h2 className="text-2xl pb-3">All Courses</h2>
      <div className="courses grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
        {data.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
