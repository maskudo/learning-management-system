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
      category {
        name
        id
      }
    }
  }
`;
