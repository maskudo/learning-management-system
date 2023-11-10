import { GET_CLASSES_BY_COURSE } from '@/graphql/query';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { useQuery } from '@apollo/client';
import { CreateClass } from '.';
import { useUserContext } from '@/context/userContext';
import ScheduleTable from '../ScheduleTable';


export default function Classes({ courseInfo }) {
  const { user } = useUserContext();
  const isTeachingThisCourse = !!user?.teaching?.find(
    (elem) => elem.course.id === courseInfo.id
  );
  const { data, error, loading } = useQuery(GET_CLASSES_BY_COURSE, {
    variables: {
      courseId: courseInfo.id,
    },
  });
  const classes =
    data?.getClassesByCourse.map((classInfo) => ({
      ...classInfo,
      teacher: classInfo?.teacher?.name,
      key: classInfo.id,
    })) ?? [];

  return (
    <div className="classes">
      {isTeachingThisCourse && (
        <CreateClass courseId={courseInfo.id} teacherId={user.id} />
      )}
      <ScheduleTable classes={classes} loading={loading} error={error} emptyMessage="No upcoming classes" />
    </div>
  );
}
