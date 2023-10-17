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

export const GET_ASSIGNMENTS_BY_COURSE_USER = gql`
  query getAssignmentByCourseUser($courseId: Int!, $userId: Int!) {
    getAssignmentsByCourseUser(courseId: $courseId, userId: $userId) {
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

export const GET_CLASSES_BY_TEACHER = gql`
  query getClassesByTeacher($teacherId: Int!) {
    getClassesByTeacher(teacherId: $teacherId) {
      id
      title
      start_time
      end_time
      course {
        name
      }
    }
  }
`;

export const GET_CLASSES_BY_USER = gql`
  query getClassesByUser($userId: Int!) {
    getClassesByUser(userId: $userId) {
      id
      title
      start_time
      end_time
      course {
        name
      }
    }
  }
`;

export const GET_ASSIGNMENTS_BY_USER = gql`
  query getAssignmentsByUser($userId: Int!) {
    getAssignmentsByUser(userId: $userId) {
      id
      deadline
      name
      course {
        name
        id
      }
    }
  }
`;

export const GET_SUBMITTED_ASSIGNMENTS_BY_COURSE = gql`
  query getSubmittedAssignmentsByCourse($courseId: Int!) {
    getSubmittedAssignmentsByCourse(courseId: $courseId) {
      id
      student {
        name
      }
      grade {
        grade
      }
      assignment {
        name
      }
    }
  }
`;

export const GET_SUBMITTED_ASSIGNMENT = gql`
  query getSubmittedAssignment($submittedAssignmentId: Int!) {
    getSubmittedAssignment(submittedAssignmentId: $submittedAssignmentId) {
      id
      assignment {
        name
      }
      student {
        id
        name
      }
      grade {
        grade
      }
      submissions {
        id
        question {
          question_text
        }
        submission_text
        submitted_option {
          option {
            option_text
            is_correct
          }
          id
        }
      }
    }
  }
`;
