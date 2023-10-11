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
      abstract
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
      enrollments {
        id
        course {
          id
        }
      }
      teaching {
        course {
          id
          name
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    users {
      name
      id
      role
    }
  }
`;

export const GET_ENROLLMENTS_BY_COURSE = gql`
  query getEnrollmentsByCourse($courseId: Int!) {
    getEnrollmentsByCourse(courseId: $courseId) {
      student {
        name
        role
        id
      }
      id
    }
  }
`;

export const GET_TEACHERS_BY_COURSE = gql`
  query getTeachersByCourse($courseId: Int!) {
    getTeachersByCourse(courseId: $courseId) {
      teacher {
        name
        role
        id
      }
    }
  }
`;

export const GET_CLASSES_BY_COURSE = gql`
  query getClassesByCourse($courseId: Int!) {
    getClassesByCourse(courseId: $courseId) {
      teacher {
        name
      }
      start_time
      end_time
      title
      id
    }
  }
`;

export const GET_ASSIGNMENTS_BY_COURSE = gql`
  query getAssignmentByCourse($courseId: Int!) {
    getAssignmentsByCourse(courseId: $courseId) {
      name
      deadline
      id
    }
  }
`;

export const GET_ASSIGNMENT = gql`
  query getAssignment($assignmentId: Int!) {
    getAssignment(assignmentId: $assignmentId) {
      id
      name
      questions {
        id
        question_text
        question_type
        question_options {
          id
          option_text
        }
      }
    }
  }
`;
