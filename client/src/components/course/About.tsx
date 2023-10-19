import { useUserContext } from '@/context/userContext';
import { ADD_ENROLLMENT } from '@/graphql/mutations';
import useAssignmentsQuery from '@/hooks/useAssignmentsQuery';
import useUserQuery from '@/hooks/useUserQuery';
import { useMutation } from '@apollo/client';
import { Button, message } from 'antd';

export default function About({ info }) {
  const [addEnrollment] = useMutation(ADD_ENROLLMENT);
  const { refetchAssignments } = useAssignmentsQuery();
  const { refetchUser } = useUserQuery();
  const { user } = useUserContext();
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
        refetchUser();
        refetchAssignments();
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const ids = user?.enrollments?.map((e) => e?.course?.id);
  const disableButton = ids?.includes(info.id);
  const isTeachingThisCourse = !!user?.teaching?.find(
    (elem) => elem.course.id === info.id
  );
  return (
    <div className="info flex flex-col gap-4 ">
      <div className="description">
        <h3 className="text-2xl font-semibold text-gray-900">Description</h3>
        <div className="text-gray-600 py-2">
          <p className="text-justify text-[1rem]">{info.description}</p>
          <p>---</p>
          <p className="text-justify text-[1rem]">{info.abstract}</p>
        </div>
      </div>
      {!isTeachingThisCourse && (
        <div className="buttons flex gap-4 ">
          <Button
            type="primary"
            className="bg-blue-500 hover:bg-blue-200  w-5/12 font-semibold"
            size="large"
            onClick={handleEnrollment}
            disabled={disableButton}
          >
            Enroll
          </Button>
          {/* <Button */}
          {/*   type="primary" */}
          {/*   danger={true} */}
          {/*   size="large" */}
          {/*   className=" w-full font-semibold" */}
          {/* > */}
          {/*   Cancel Enrollment */}
          {/* </Button> */}
        </div>
      )}
    </div>
  );
}
