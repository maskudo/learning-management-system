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
    }

    type Query {
        users: [User!]
        user(userId: Int!): User
        login(email: String, password: String): User
    }
"""
)
