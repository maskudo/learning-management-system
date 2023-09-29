from ariadne import gql

type_defs = gql(
    """
    scalar Datetime
    enum Role {
        admin
        student
        teacher
    }

    type User {
        id: Int!
        name: String!
        email: String!
        birth_date: Datetime!
        phone_no: String!
        role: Role!
    }

    type Category {
        id: Int!
        name: String!
        description: String
    }

    type Course {
        id: Int!
        name: String!
        abstract: String
        bibliography: String
        description: String
        created_at : Datetime!
        category: Category!
    }

    type Enrollment {
        id: Int!
        enrollment_date: Datetime!
        student_id: Int!
        course_id: Int!
        cancelled: Boolean
        cancellation_reason: String
    }

    input AddEnrollmentInput{
        student_id: Int!
        course_id: Int!
        cancelled: Boolean
        cancellation_reason: String
        
    }

    input UpdateEnrollmentInput {
        id: Int!
        cancelled: Boolean
        cancellation_reason: String
    }

    input AddCourseInput {
        name: String!
        abstract: String
        bibliography: String
        description: String
        category: Int!
    }

    input AddUserInput {
        name: String!
        email: String!
        password: String!
        birth_date: Datetime!
        phone_no: String!
        role: Role!
    }
    
    type Mutation {
        addUser(user: AddUserInput!): User 
        deleteUser(userId: Int!): Boolean
        addCategory(name: String!, description: String): Category
        deleteCategory(categoryId: Int!): Boolean
        addCourse(course: AddCourseInput!): Course
        deleteCourse(courseId: Int!): Boolean
        addEnrollment(enrollment: AddEnrollmentInput!): Enrollment
        updateEnrollment(enrollment: UpdateEnrollmentInput!): Enrollment
    }

    type Query {
        users: [User!]
        user(userId: Int!): User
        login(email: String, password: String): User
        courses: [Course!]
        course(courseId: Int!): Course
    }
"""
)
