import { ADD_ENROLLMENT } from '@/graphql/mutations';
import { GET_USER_BY_EMAIL } from '@/graphql/query';
import { useApolloClient, useMutation } from '@apollo/client';
import { Button, message } from 'antd';
import { CreateClass } from '.';
export default function Classes({ courseInfo }) {
  const client = useApolloClient();
  const email = localStorage.getItem('email');
  const user = client.readQuery({
    query: GET_USER_BY_EMAIL,
    variables: {
      email,
    },
  })?.getUserByEmail;
  const isTeachingThisCourse = !!user?.teaching?.find(
    (elem) => elem.course.id === courseInfo.id
  );
  return (
    <div className="classes">
      {isTeachingThisCourse && (
        <CreateClass courseId={courseInfo.id} teacherId={user.id} />
      )}
    </div>
  );
}
