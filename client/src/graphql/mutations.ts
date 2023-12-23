import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      token
    }
  }
`;

export const REGISTER = gql`
  mutation register($user: AddUserInput!) {
    register(user: $user) {
      id
    }
  }
`;

export const ADD_ENROLLMENT = gql`
  mutation addEnrollment($enrollment: AddEnrollmentInput!) {
    addEnrollment(enrollment: $enrollment) {
      id
    }
  }
`;
export const ADD_CLASS = gql`
  mutation addClass($classInfo: AddClassInput!) {
    addClass(classInfo: $classInfo) {
      title
      end_time
      start_time
    }
  }
`;

export const SUBMIT_ASSIGNMENT = gql`
  mutation submitAssignment($submittedAssignment: SubmittedAssignmentInput!) {
    submitAssignment(submittedAssignment: $submittedAssignment)
  }
`;

export const ADD_ASSIGNMENT = gql`
  mutation addAssignment($assignmentInfo: AddAssignmentInput!) {
    addAssignment(assignmentInfo: $assignmentInfo) {
      id
      name
    }
  }
`;

export const SUBMIT_GRADE = gql`
  mutation submitGrade($submittedGrade: SubmitGradeInput!) {
    submitGrade(submittedGrade: $submittedGrade)
  }
`;

export const SUBMIT_RESOURCES = gql`
  mutation submitResources($resources: ResourceInput!) {
    submitResources(resources: $resources)
  }
`;
export const UPLOAD_RESOURCES = gql`
  mutation uploadFileResources($courseId: Int!, $files: [Upload!]!) {
    uploadFileResources(courseId: $courseId, files: $files)
  }
`;

export const ADD_CATEGORY = gql`
  mutation addCategory($name: String!, $description: String) {
    addCategory(name: $name, description: $description) {
      id
    }
  }
`;
export const ADD_COURSE = gql`
  mutation addCourse($course: AddCourseInput!) {
    addCourse(course: $course) {
      id
      name
      description
    }
  }
`;
export const ADD_COURSE_TEACHER = gql`
  mutation addCourseTeacher($courseId: Int!, $teacherId: Int!) {
    addCourseTeacher(courseId: $courseId, teacherId: $teacherId) {
      teacher {
        name
        id
      }
    }
  }
`;
