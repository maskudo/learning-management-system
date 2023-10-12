import AssignmentListItem from '@/components/assignment/AssignmentListItem';
import { useUserContext } from '@/context/userContext';
import { GET_ASSIGNMENTS_BY_USER } from '@/graphql/query';
import { useQuery } from '@apollo/client';

export default function Dashboard() {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_ASSIGNMENTS_BY_USER, {
    variables: {
      userId: user?.id,
    },
  });
  const assignments = data?.getAssignmentsByUser ?? [];
  return (
    <div className="dashboard">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl">Due Assignments</h2>
          <div className="flex flex-col gap-4">
            {!assignments.length ? (
              <p>No Assignments Due :) </p>
            ) : (
              assignments.map((assignment) => (
                <AssignmentListItem assignment={assignment} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
