import { GET_SUBMITTED_ASSIGNMENT } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

export default function Submission() {
  const { submission } = useParams();
  const { data, loading, error } = useQuery(GET_SUBMITTED_ASSIGNMENT, {
    variables: {
      submittedAssignmentId: parseInt(submission),
    },
  });
  console.log(data);
  return (
    <div className="submission">
      <div className="header pb-6">
        <h2 className="text-2xl">
          Assignment: {data?.getSubmittedAssignment?.assignment?.name}
        </h2>
        <h2 className="text-xl">
          By {data?.getSubmittedAssignment?.student?.name}
        </h2>
      </div>
      {data?.getSubmittedAssignment?.submissions?.map((submission, index) => {
        return (
          <div>
            <p>
              {index + 1}. {submission?.question?.question_text}
            </p>
            <p>
              {'-> '}{' '}
              {!submission?.submitted_option ? (
                submission.submission_text
              ) : (
                <div>
                  {submission.submitted_option.option.option_text}{' '}
                  {submission?.submitted_option.option?.is_correct
                    ? 'right'
                    : 'wrong'}
                </div>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
