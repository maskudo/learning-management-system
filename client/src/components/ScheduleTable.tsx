import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { Empty, Table } from 'antd';
import { Link } from 'react-router-dom';
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text: string, record) => <Link to={`/class/${record.key}`} className="capitalize underline underline-offset-2">{text}</Link>,
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
export default function ScheduleTable({
  loading,
  error,
  classes,
  emptyMessage,
}) {
  return (
    <div className="schedule-table ">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div className="classes">
          <div>
            {!classes?.length ? (
              <Empty
                className="h-full border p-4 shadow-md"
                description={
                  <div className="text-gray-600">{emptyMessage}</div>
                }
              />
            ) : (
              <Table
                columns={columns}
                dataSource={classes}
                className="shadow-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
