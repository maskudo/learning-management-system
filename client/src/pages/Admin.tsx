import AddCategory from '@/components/admin/AddCategory';
import AddCourse from '@/components/admin/AddCourse';
import { Collapse, CollapseProps } from 'antd';

const items: CollapseProps['items'] = [
  {
    key: 1,
    label: 'Add Category',
    children: <AddCategory />,
  },
  {
    key: 2,
    label: 'Add Course',
    children: <AddCourse />,
  },
];
function Admin() {
  return (
    <div>
      <Collapse items={items} />
    </div>
  );
}

export default Admin;
