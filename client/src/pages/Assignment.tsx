import { GET_ASSIGNMENT } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Radio } from 'antd';

export default function Assignment() {
  const { assignment } = useParams();
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
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="assignment">
      <div className="text-2xl mb-8">{title}</div>
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!sorted.length && <div> No assignment found.</div>}
      {!loading && !error && !!sorted.length && (
        <Form className=" m-auto" layout="vertical" onFinish={handleSubmit}>
          {sorted.map((question, index) =>
            question.question_type === 'essay' ? (
              <Form.Item
                label={`${index + 1}. ` + question.question_text}
                name={question.id}
              >
                <Input />
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
            )
          )}
          {!!sorted.length && (
            <Form.Item>
              <Button
                type="primary"
                className="bg-blue-400 text-white my-2"
                // styles={{ color: 'white' }}
                block
                size="large"
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
