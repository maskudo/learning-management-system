import { ADD_ENROLLMENT } from '@/graphql/mutations';
import { GET_USER_BY_EMAIL } from '@/graphql/query';
import { useApolloClient, useMutation } from '@apollo/client';
import { Button, message } from 'antd';

export default function About({ info }) {
  const [addEnrollment] = useMutation(ADD_ENROLLMENT);
  const client = useApolloClient();
  const email = localStorage.getItem('email');
  const user = client.readQuery({
    query: GET_USER_BY_EMAIL,
    variables: {
      email,
    },
  })?.getUserByEmail;
  const handleEnrollment = async () => {
    try {
      const { data } = await addEnrollment({
        variables: {
          enrollment: {
            student_id: user.id,
            course_id: info.id,
          },
        },
      });
      if (data?.addEnrollment?.id) {
        message.success('Successfully Enrolled into the course!');
      }
    } catch (e) {
      message.error(e.message);
    }
  };
  const disableEnrollment = user?.enrollments?.indexOf(
    (enrollment) => enrollment?.course?.id === info.id
  );
  return (
    <div className="info flex flex-col gap-4 ">
      <div className="description">
        <h3 className="text-2xl">Description</h3>
        <p className="text-justify text-[1rem]">{info.description}</p>
      </div>
      <div className="abstract ">
        <h3 className="text-2xl">Abstract</h3>
        <p className="text-justify text-[1rem]">{info.abstract}</p>
      </div>
      <div className="buttons flex gap-4 ">
        <Button
          type="primary"
          className="bg-blue-600 hover:bg-blue-200  w-full"
          size="large"
          onClick={handleEnrollment}
          disabled={disableEnrollment}
        >
          Enroll
        </Button>
        <Button type="primary" danger={true} size="large" className=" w-full">
          Cancel Enrollment
        </Button>
      </div>
    </div>
  );
}
