import AssignmentListItem from '@/components/assignment/AssignmentListItem';
import { useUserContext } from '@/context/userContext';
import useAssignmentsQuery from '@/hooks/useAssignmentsQuery';

export default function Dashboard() {
  const { user } = useUserContext();
  const { data, error, loading } = useAssignmentsQuery();
  const assignments = data ?? [];
  return (
    <div className="dashboard">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl">Welcome {user?.name}</h2>
          <h2 className="text-2xl">Your Due Assignments</h2>
          <div className="flex flex-col gap-4">
            {!assignments.length ? (
              <p>No Assignments Due :) </p>
            ) : (
              assignments.map((assignment) => (
                <AssignmentListItem
                  key={assignment.id}
                  assignment={assignment}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
