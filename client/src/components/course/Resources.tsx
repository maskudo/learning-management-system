import { useQuery } from '@apollo/client';
import CreateResources from './CreateResources';
import { GET_RESOURCES_BY_COURSE } from '@/graphql/query';
import { Collapse } from 'antd';
import { useUserContext } from '@/context/userContext';

export default function Resources({ courseId }) {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_RESOURCES_BY_COURSE, {
    variables: {
      courseId,
    },
  });
  const items = data?.getResourcesByCourse?.map((item) => ({
    key: item.id,
    label: item.title,
    children: <p> {item.description}</p>,
  }));
  const teachingCourses = user?.teaching?.map((course) => course.course.id);
  const isTeachingThisCourse = teachingCourses?.includes(parseInt(courseId));
  return (
    <div>
      {(isTeachingThisCourse || user?.role?.toLowerCase() === 'admin') && (
        <CreateResources courseId={courseId} />
      )}
      <div className="resources">
        {loading && <div>Loading... </div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <div>
            <Collapse items={items} />
          </div>
        )}
      </div>
    </div>
  );
}
