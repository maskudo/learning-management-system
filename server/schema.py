from ariadne import gql

type_defs = gql(
    """
    scalar Datetime
    enum Role {
        admin
        student
        teacher
    }
    type Error {
        status: Int!
        message: String!
    }

    type User {
        id: Int!
        name: String!
        email: String!
        birth_date: Datetime!
        phone_no: String!
        role: Role!
        enrollments: [Enrollment!]
        teaching: [CourseTeacher!]
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
        student: User!
        course: Course!
        cancelled: Boolean
        cancellation_reason: String
    }
    
    type CourseTeacher {
        id: Int!
        teacher: User!
        course: Course!
    }

    type Class {
        id: Int!
        title: String!
        start_time: Datetime!
        end_time: Datetime!
        teacher: User!
        course: Course!
        cancelled: Boolean
        cancellation_reason: String
    }

    input AddClassInput {
        title: String!
        start_time: Datetime!
        end_time: Datetime!
        teacher_id: Int!
        course_id: Int!
        cancelled: Boolean
        cancellation_reason: String
    }

    input UpdateClassInput {
        title: String
        start_time: Datetime
        end_time: Datetime
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
    type LoginInfo {
        email: String!
        token: String!
    }
    
    type Mutation {
        register(user: AddUserInput!): User 
        login(email: String, password: String): LoginInfo
        deleteUser(userId: Int!): Boolean
        addCategory(name: String!, description: String): Category
        deleteCategory(categoryId: Int!): Boolean
        addCourse(course: AddCourseInput!): Course
        deleteCourse(courseId: Int!): Boolean
        addEnrollment(enrollment: AddEnrollmentInput!): Enrollment
        updateEnrollment(enrollment: UpdateEnrollmentInput!): Enrollment
        addCourseTeacher(courseId: Int!, teacherId: Int!): CourseTeacher
        addClass(classInfo: AddClassInput!): Class
        updateClass(classInfo: UpdateClassInput!): Class
    }

    type Query {
        users: [User!]
        user(userId: Int!): User
        getUserByEmail(email: String!): User
        courses: [Course!]
        course(courseId: Int!): Course
        categories: [Category!]
        category(categoryId: Int!): Category
        enrollments: [Enrollment!]
        enrollment(enrollmentId: Int!): Enrollment
        getEnrollmentsByCourse(courseId: Int!): [Enrollment]
        getTeachersByCourse(courseId: Int!): [CourseTeacher]
        getClassesByCourse(courseId: Int!): [Class]
        getClassesByTeacher(teacherId: Int!): [Class]
    }
"""
)
