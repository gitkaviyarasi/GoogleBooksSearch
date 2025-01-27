const typeDefs =  `
type Book{
  bookId: String!
  title: String
  authors: [String]
  description: String
  image: String
  link: String
  }

input BookInput{
  bookId: String!
  title: String
  authors: [String]
  description: String
  image: String
  link: String
  }  

type User{
    _id: ID
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int
    }

type  Auth{
    token: String!
    user: User!
    }

 type Query{
    me: User
}
  
input userInput{
    username: String!
    email: String!
    password: String!
}


type Mutation{
    login(email: String!, password: String!): Auth
    addUser(input:userInput): Auth
    saveBook(input:BookInput): User
    removeBook(bookId:ID!): User
} 
` ;
export default typeDefs;   