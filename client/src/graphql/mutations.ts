import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String, $password: String) {
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
