import { useUserContext } from '@/context/userContext';
import { GET_CLASSES_BY_TEACHER, GET_CLASSES_BY_USER } from '@/graphql/query';
import { useQuery } from '@apollo/client';

import ScheduleTable from '@/components/ScheduleTable';

export default function Schedule() {
  const { user } = useUserContext();
  const { data, error, loading } = useQuery(GET_CLASSES_BY_USER, {
    variables: {
      userId: user?.id,
    },
  });
  const teachingData = useQuery(GET_CLASSES_BY_TEACHER, {
    variables: {
      teacherId: user?.id,
    },
  });
  const classes = data?.getClassesByUser.map((cls) => ({
    ...cls,
    key: cls.id,
    course: cls.course.name,
  }));
  const teachingClasses = teachingData?.data?.getClassesByTeacher.map(
    (cls) => ({
      ...cls,
      key: cls.id,
      course: cls.course.name,
    })
  );

  return (
    <div className="schedule flex flex-col gap-12">
      {user?.role !== 'student' && (
        <div>
          <h2 className="text-2xl">Teaching Classes</h2>
          <ScheduleTable
            loading={teachingData?.data?.loading}
            error={teachingData?.data?.error}
            classes={teachingClasses}
          />
        </div>
      )}
      <div>
        <h2 className="text-2xl">Upcoming Classes</h2>
        <ScheduleTable loading={loading} error={error} classes={classes} />
      </div>
    </div>
  );
}
