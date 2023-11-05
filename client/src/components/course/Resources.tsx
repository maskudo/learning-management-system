import { useApolloClient, useQuery } from '@apollo/client';
import CreateResources from './CreateResources';
import { GET_RESOURCES_BY_COURSE } from '@/graphql/query';
import { Collapse, Empty } from 'antd';
import { useUserContext } from '@/context/userContext';
import { Link } from 'react-router-dom';
import Video from '@/pages/Video';

export default function Resources({ courseId }) {
  const { user } = useUserContext();
  const client = useApolloClient();
  const { data, error, loading, refetch } = useQuery(GET_RESOURCES_BY_COURSE, {
    variables: {
      courseId,
    },
  });
  // console.log(data?.getResourcesByCourse);
  const items = data?.getResourcesByCourse?.map((item) => ({
    key: item.id,
    label: item.title,
    children: (
      <div>
        <p>{item.description}</p>
        <div className="pt-3">
          <h4 className="text-lg text-orange-600">Attachments: </h4>
          {item.files?.map((file) => {
            const temp = file.path.split('.');
            const extension = temp[temp.length - 1];
            if (extension === 'pdf') {
              return (
                <a
                  key={file.id}
                  href={import.meta.env.VITE_API_ROUTE + '/' + file.path}
                  target="_black"
                  className="text-blue-600"
                >
                  {file.name}
                </a>
              );
            } else {
              return <Video file={file} />;
            }
          })}
        </div>
      </div>
    ),
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
