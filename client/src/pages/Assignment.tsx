import { GET_ASSIGNMENT } from '@/graphql/query';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Radio, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { SUBMIT_ASSIGNMENT } from '@/graphql/mutations';
import { useUserContext } from '@/context/userContext';

export default function Assignment() {
  const navigate = useNavigate();

  const client = useApolloClient();
  const { user } = useUserContext();
  const [submitAssignment] = useMutation(SUBMIT_ASSIGNMENT);
  const { assignment, id } = useParams();
  const { data, error, loading } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: parseInt(assignment ?? ''),
    },
  });
  const questions = data?.getAssignment?.questions ?? [];
  const title = data?.getAssignment?.name;
  const sorted = [
    ...questions.filter((q) => q.question_type === 'essay'),
    ...questions.filter((q) => q.question_type !== 'essay'),
  ];
  const handleSubmit = async (values) => {
    const solutions = Object.entries(values).map(([question, solution]) => ({
      question: parseInt(question),
      answer: {
        submission_text: typeof solution === 'number' ? null : solution,
        submitted_option: typeof solution === 'string' ? null : solution,
      },
    }));
    const assignment_id = assignment;
    const student_id = user.id;
    const { data } = await submitAssignment({
      variables: {
        submittedAssignment: {
          student_id: parseInt(student_id),
          assignment_id: parseInt(assignment_id),
          solutions,
        },
      },
    });
    if (data?.submitAssignment) {
      message.success('Successfully submitted the assignment.');
      client.refetchQueries([
        'getAssignmentByCourseUser',
        'getAssignmentsByUser',
      ]);
      navigate('/');
    }
  };
  const teachingCourses = user?.teaching?.map((course) => course.course.id);
  const isTeachingThisCourse = teachingCourses?.includes(parseInt(id));

  return (
    <div className="assignment">
      <div className="text-2xl mb-8">{title}</div>
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && !!sorted.length && (
        <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
          {sorted.map((question, index) => (
            <div key={question.id}>
              {question.question_type === 'essay' ? (
                <Form.Item
                  label={`${index + 1}. ` + question.question_text}
                  name={question.id}
                >
                  <TextArea rows={10} maxLength={1000} showCount />
                </Form.Item>
              ) : (
                <div className="flex">
                  <Form.Item
                    name={question.id}
                    label={`${index + 1}. ` + question.question_text}
                  >
                    <Radio.Group className="flex">
                      {question.question_options.map((option) => (
                        <Radio key={option.id} value={option.id}>
                          {option.option_text}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
            </div>
          ))}
          {!!sorted.length && (
            <Form.Item>
              <Button
                type="primary"
                className="bg-blue-400 text-white my-2"
                // styles={{ color: 'white' }}
                block
                size="large"
                disabled={isTeachingThisCourse}
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </div>
  );
}
