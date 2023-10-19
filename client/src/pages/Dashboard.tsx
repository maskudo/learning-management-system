import AssignmentListItem from '@/components/assignment/AssignmentListItem';
import { useUserContext } from '@/context/userContext';
import useAssignmentsQuery from '@/hooks/useAssignmentsQuery';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUserContext();
  const { data, error, loading } = useAssignmentsQuery();
  const navigate = useNavigate();
  const assignments = data ?? [];
  return (
    <div className="dashboard">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-6">
          <h2 className="text-5xl font-thin ">
            Welcome back, <br /> {user?.name}
          </h2>
          <h3 className="font-thin text-2xl ">Overview</h3>
          <div className="overview gap-2 grid grid-cols-2">
            <div
              className="px-2 border-2 shadow-md  h-[10rem] flex justify-around flex-col font-thin text-3xl rounded-md hover:bg-gray-200 bg-gray-50"
              onClick={() => navigate('courses')}
            >
              <div>Active Courses</div>
              <div className="text-6xl font-bold text-gray-700">
                {user?.enrollments?.length}
              </div>
            </div>
            <div className="px-2 border-2 shadow-md  h-[10rem] flex justify-around flex-col font-thin text-3xl rounded-md hover:bg-gray-200 bg-gray-50">
              <div>Assignments Due</div>
              <div className="text-6xl font-bold text-gray-700">
                {data?.length}
              </div>
            </div>
            {user?.role !== 'student' && (
              <div className="px-2 border-2 shadow-md  h-[10rem] flex justify-around flex-col font-thin text-3xl rounded-md hover:bg-gray-200 bg-gray-50 col-span-full">
                <div>Teaching courses</div>
                <div className="text-6xl font-bold text-gray-700">
                  {user?.teaching?.length}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 min-h-[30vh]">
            {!!assignments.length && (
              <div className="">
                <h3 className="font-thin text-2xl mb-4">Your Assignments</h3>
                <div className="flex flex-col gap-2">
                  {assignments.map((assignment) => (
                    <AssignmentListItem
                      key={assignment.id}
                      assignment={assignment}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
