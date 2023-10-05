import { gql } from '@apollo/client';
export const GET_CATEGORIES = gql`
  query getCategories {
    categories {
      name
      description
      id
    }
  }
`;
export const GET_COURSES = gql`
  query getCourses {
    courses {
      name
      id
      description
      category {
        name
        id
      }
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  query getCourseById($id: Int!) {
    course(courseId: $id) {
      name
      id
      description
      category {
        name
        id
      }
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      name
      id
      role
    }
  }
`;
