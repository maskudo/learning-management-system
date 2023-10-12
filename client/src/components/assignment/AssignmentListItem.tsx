import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
export default function AssignmentListItem({ assignment }) {
  const deadline = dayjs(assignment.deadline).format(
    'dddd, DD MMMM [at] HH:mm'
  );
  return (
    <div className="assignmentItem flex justify-between shadow py-4 px-2">
      <div className="left flex flex-col">
        <Link
          to={`/courses/${assignment.course.id}/assignment/${assignment.id}`}
          className="text-blue-700"
        >
          {assignment.name}
        </Link>
        <Link to={`/courses/${assignment.course.id}`} className="text-xs">
          {assignment.course.name}
        </Link>
      </div>
      <div className="right">
        <div> Due {deadline}</div>
      </div>
    </div>
  );
}
