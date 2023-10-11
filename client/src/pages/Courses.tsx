import CourseCard from '@/components/common/CourseCard';
import { useUserContext } from '@/context/userContext';
import { GET_COURSES } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Tabs } from 'antd';

export default function Courses() {
  const { loading, error, data } = useQuery(GET_COURSES);
  const courses = data?.courses;
  const { user } = useUserContext();
  const myCoursesId = user?.enrollments.map(
    (enrollment) => enrollment.course.id
  );
  const myCourses = courses?.filter(
    (course) => myCoursesId?.includes(course.id)
  );

  return (
    <>
      {!!error && <div>Error fetching data. Try again later. </div>}
      {!!loading && <div>Loading...</div>}
      {!error && !loading && (
        <div className="courses-container">
          <h2 className="text-2xl pb-3">Courses</h2>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: 'My Courses',
                key: '1',
                children: (
                  <div className="courses grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {myCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ),
              },
              {
                label: 'All Courses',
                key: '2',
                children: (
                  <div className="courses grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
