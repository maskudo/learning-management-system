import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const CourseCard: React.FC = ({ course }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`${course.id}`);
  return (
    <Card
      className=""
      onClick={handleClick}
      cover={
        <img
          alt="course-cover"
          src={
            course.image ??
            'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
          }
        />
      }
    >
      <Meta
        title={course.name}
        description={<p className="line-clamp-1">{course.description}</p>}
      />
    </Card>
  );
};

export default CourseCard;
