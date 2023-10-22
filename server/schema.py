from ariadne import gql

type_defs = gql(
    """
    scalar Datetime
    scalar Upload
    enum Role {
        admin
        student
        teacher
    }
    enum QuestionType {
        multiple_choice
        essay
    }
    enum GradeLetter {
        A
        B
        C
        D
        E
        F
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
        resources: [Resource]!
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

    type Assignment {
        id: Int!
        name: String!
        course: Course!
        deadline: Datetime!
        questions: [Question!]
    }

    type Question {
        id: Int!
        question_text:String!
        question_type: QuestionType!
        question_options: [QuestionOption!]
    }
    
    type QuestionOption {
        id: Int!
        option_text: String!
        is_correct: Boolean!
    }

    type Grade {
        id: Int!
        grade: GradeLetter!
    }

    type Submission {
        id: Int!
        assignment: Assignment!
        question: Question!
        student: User!
        submission_text: String
        score: Int
        submitted_option: SubmittedOption
    }
    type SubmittedAssignment {
        id: Int!
        student: User!
        grade: Grade
        assignment: Assignment!
        submissions: [Submission!]
    }
    type SubmittedOption {
        id: Int
        submission: Submission
        option: QuestionOption
    }

    type FileResource {
        created_at: Datetime!
        path: String!
        id: Int!
        name: String!
    }

    type Resource {
        id: Int!
        title: String!
        description: String!
        course_id: Int!
        files: [FileResource!]
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
    input OptionInfo {
        text: String!
        is_correct: Boolean
    }
    input QuestionInput {
        question: String!
        options: [OptionInfo!]
        type: QuestionType!
    }
    input AddAssignmentInput{
        name: String!
        deadline: Datetime!
        course_id: Int!
        questions: [QuestionInput]
    }
    input AddQuestionInput{
        assignment_id: Int!
        question_text: String!
        question_type: QuestionType!
        
    }
    input AddQuestionOptionInput{
        question_id: Int!
        option_text: String!
        is_correct: Boolean!

    }
    input AddSubmissionInput{
        assignment_id: Int!
        question_id: Int!
        student_id: Int!
        submission_text: String
        score: Int

    }
    input AddSubmittedOptionInput{
        submission_id: Int!
        option_id: Int!
    }

    input QuestionAnswerInput {
        question: Int!
        answer: Solution
    }
    input Solution {
        submission_text: String
        submitted_option: Int
    }
    input SubmittedAssignmentInput{
        assignment_id: Int!
        student_id: Int!
        solutions : [QuestionAnswerInput]
    }
    input SubmitGradeInput{
        submittedAssignmentId: Int!
        grade: GradeLetter!
    }
    input ResourceInfo {
        title: String!
        description: String!
        files: [Upload!]

    }
    input ResourceInput {
        course_id: Int!
        resources: [ResourceInfo!]!
    }
    
    type Mutation {
        register(user: AddUserInput!): User 
        login(email: String!, password: String!): LoginInfo
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
        addAssignment(assignmentInfo: AddAssignmentInput!): Assignment
        addQuestion(questionInfo: AddQuestionInput!): Question
        addQuestionOption(questionOptionInfo: AddQuestionOptionInput!): QuestionOption
        addSubmission(submissionInfo: AddSubmissionInput!): Submission
        addSubmittedOption(submittedOptionInfo: AddSubmittedOptionInput!): SubmittedOption
        submitAssignment(submittedAssignment: SubmittedAssignmentInput!): Boolean
        submitGrade(submittedGrade: SubmitGradeInput!): Boolean
        submitResources(resources: ResourceInput!): Boolean
        uploadFileResources(courseId: Int!, files: [Upload!]!): Boolean
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
        getClassesByUser(userId: Int!): [Class]
        getClassesByTeacher(teacherId: Int!): [Class]
        getAssignment(assignmentId: Int!): Assignment
        getAssignmentsByCourse(courseId: Int!): [Assignment!]
        getAssignmentsByCourseUser(courseId: Int!, userId: Int!): [Assignment!]
        getAssignmentsByUser(userId: Int!): [Assignment!]
        getQuestion(questionId: Int!): Question
        getQuestionsByAssignment(assignmentId: Int!): [Question!]
        getQuestionOption(questionOptionId: Int!): QuestionOption
        getSubmission(submissionId: Int!): Submission
        getSubmissionsByCourse(courseId: Int!): [Submission]
        getSubmittedOption(submittedOptionId: Int!): SubmittedOption
        getSubmittedAssignmentsByCourse(courseId: Int!): [SubmittedAssignment!]
        getSubmittedAssignment(submittedAssignmentId: Int!): SubmittedAssignment!
        getResourcesByCourse(courseId: Int!): [Resource]
    }
"""
)
