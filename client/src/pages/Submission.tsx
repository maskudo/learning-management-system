import { GET_SUBMITTED_ASSIGNMENT } from '@/graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FaCheck, FaPenNib, FaXmark } from 'react-icons/fa6';
import { Button, Form, Select, message } from 'antd';
import { SUBMIT_GRADE } from '@/graphql/mutations';
import { useUserContext } from '@/context/userContext';

export default function Submission() {
  const { user } = useUserContext();
  const { submission, id } = useParams();
  const { data, loading, error } = useQuery(GET_SUBMITTED_ASSIGNMENT, {
    variables: {
      submittedAssignmentId: parseInt(submission),
    },
  });
  const [submitGrade] = useMutation(SUBMIT_GRADE);
  const handleSubmit = async (values) => {
    try {
      await submitGrade({
        variables: {
          submittedGrade: {
            grade: values.grade,
            submittedAssignmentId: data.getSubmittedAssignment.id,
          },
        },
      });
      message.success('Grade submitted successfully!');
    } catch (e) {
      message.error(e.message);
    }
  };
  const grade = data?.getSubmittedAssignment?.grade?.grade;
  const teachingCourses = user?.teaching?.map((course) => course.course.id);
  const isTeachingThisCourse = teachingCourses?.includes(parseInt(id));
  return (
    <div className="submission">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="header pb-6">
          <h2 className="text-2xl">
            Assignment: {data?.getSubmittedAssignment?.assignment?.name}
          </h2>
          <h2 className="text-xl">
            By {data?.getSubmittedAssignment?.student?.name}
          </h2>
        </div>
      )}
      <div className="submitted-answers flex flex-col gap-4">
        {data?.getSubmittedAssignment?.submissions?.map((submission, index) => {
          return (
            <div key={submission.id} className="flex flex-col gap-1">
              <p>
                {index + 1}. {submission?.question?.question_text}
              </p>
              <div className="flex gap-2 items-center">
                <FaPenNib className="w-4 h-4" />
                {!submission?.submitted_option ? (
                  <div>{submission.submission_text}</div>
                ) : (
                  <div className="flex w-full  items-center gap-2">
                    <div>{submission.submitted_option.option.option_text} </div>
                    <div>
                      {submission?.submitted_option.option?.is_correct ? (
                        <FaCheck className="w-4 h-4 text-green-400" />
                      ) : (
                        <FaXmark className="w-4 h-4 text-red-400" />
                      )}{' '}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!loading &&
        !error &&
        (grade ? (
          <div className="my-8">Grade: {grade}</div>
        ) : (
          isTeachingThisCourse && (
            <Form
              name="basic"
              layout="vertical"
              initialValues={{ remember: true, grade: '' }}
              onFinish={handleSubmit}
              className="my-8"
            >
              <div className="flex items-center gap-2">
                <Form.Item
                  label="Grade"
                  name="grade"
                  rules={[
                    { required: true, message: 'Please assign as grade.' },
                  ]}
                >
                  <Select
                    // defaultValue=""
                    placeholder="Grade"
                    size="large"
                    aria-required
                    style={{ width: 120 }}
                    options={[
                      { value: 'A', label: 'A' },
                      { value: 'B', label: 'B' },
                      { value: 'C', label: 'C' },
                      { value: 'D', label: 'D' },
                      { value: 'E', label: 'E' },
                      { value: 'F', label: 'F' },
                    ]}
                  />
                </Form.Item>
                <Form.Item label=" ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-400 text-white "
                    block
                    size="large"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          )
        ))}
    </div>
  );
}
