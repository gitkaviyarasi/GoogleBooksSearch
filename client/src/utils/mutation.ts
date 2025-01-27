import {gql } from '@apollo/client';    

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
login(email: $email, password: $password) {
token
user {
_id
username
}
}
}
`;
export const ADD_USER = gql`
mutation AddUser($input: userInput) {
  addUser(input: $input) {
    user {
      username
      email
      _id
    }
    token
  }
}
`;
export const SAVE_BOOK = gql `
mutation saveBook($input: BookInput) {
  saveBook(input: $input) {
    _id
    savedBooks {
      bookId
      title
      authors
      description
      image
      link
    }
  }
}


`;
export const REMOVE_BOOK = gql`
mutation ($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    username
    email
    savedBooks {
      bookId
      title
      authors
      description
      image
      link
    }
    bookCount
  }
}
`;
