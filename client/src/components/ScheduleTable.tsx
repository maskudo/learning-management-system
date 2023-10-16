import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { Table } from 'antd';
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Course',
    dataIndex: 'course',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
  {
    title: 'Start Time',
    dataIndex: 'start_time',
    render: (text: string) => <div>{dayjs(text).format('LLLL')}</div>,
  },
  {
    title: 'End Time',
    dataIndex: 'end_time',
    render: (text: string) => <div>{dayjs(text).format('LLLL')}</div>,
  },
];
export default function ScheduleTable({ loading, error, classes }) {
  return (
    <div className="schedule-table">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="classes">
          <div>
            {!classes?.length ? (
              <div> No classes yet</div>
            ) : (
              <Table columns={columns} dataSource={classes} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
