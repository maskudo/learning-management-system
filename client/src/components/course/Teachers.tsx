import { GET_USERS } from '@/graphql/query';
import { useQuery } from '@apollo/client';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    render: (text: string) => <div className="capitalize">{text}</div>,
  },
];

export default function Teachers() {
  const { data, error, loading } = useQuery(GET_USERS);
  const users = data?.users.map((user) => ({ ...user, key: user.id }));
  return (
    <div className="participants">
      {loading && <div>Loading... </div>}
      {error && <div>{error.message}</div>}
      {!loading && !error && (
        <div>
          {!users?.length ? (
            <div> No teachers yet</div>
          ) : (
            <Table columns={columns} dataSource={users} />
          )}
        </div>
      )}
    </div>
  );
}
