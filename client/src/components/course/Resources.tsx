import { useApolloClient, useQuery } from '@apollo/client';
import CreateResources from './CreateResources';
import { GET_RESOURCES_BY_COURSE } from '@/graphql/query';
import { Collapse } from 'antd';
import { useUserContext } from '@/context/userContext';

export default function Resources({ courseId }) {
  const { user } = useUserContext();
  const client = useApolloClient();
  const { data, error, loading, refetch } = useQuery(GET_RESOURCES_BY_COURSE, {
    variables: {
      courseId,
    },
  });
  const items = data?.getResourcesByCourse?.map((item) => ({
    key: item.id,
    label: item.title,
    children: <p> {item.description}</p>,
  }));
  const refetchResources = () => {
    refetch().then((data) => {
      client.writeQuery({
        query: GET_RESOURCES_BY_COURSE,
        data: data.data,
        variables: {
          courseId,
        },
      });
    });
  };
  const teachingCourses = user?.teaching?.map((course) => course.course.id);
  const isTeachingThisCourse = teachingCourses?.includes(parseInt(courseId));
  return (
    <div>
      {(isTeachingThisCourse || user?.role?.toLowerCase() === 'admin') && (
        <CreateResources
          courseId={courseId}
          refetchResources={refetchResources}
        />
      )}
      <div className="resources">
        {loading && <div>Loading... </div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <div>
            {items?.length ? (
              <Collapse items={items} />
            ) : (
              <div>No resources for this course yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
