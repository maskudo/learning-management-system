import { useApolloClient, useQuery } from '@apollo/client';
import CreateResources from './CreateResources';
import { GET_RESOURCES_BY_COURSE } from '@/graphql/query';
import { Collapse, Empty } from 'antd';
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
          <div className="flex flex-col gap-4 min-h-[30vh]">
            {items?.length ? (
              <Collapse items={items} />
            ) : (
              <Empty
                className="h-full border p-4"
                description={
                  <div className="text-gray-600"> No resources available.</div>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
