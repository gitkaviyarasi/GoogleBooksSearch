//import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

//import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
//import type { User } from '../models/User';
import type { SavedBook } from '../models/Book';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutation';
import { useQuery,useMutation} from '@apollo/client';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || {};


  // Mutation to remove a book
  const [removeBook] = useMutation(REMOVE_BOOK, {
    // Update cache after removing a book
    update(cache, { data: { removeBook } }) {
      try {
        const { me } = (cache.readQuery({ query: GET_ME }) as { me: typeof userData }) || {};
        if (me) {
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: {
                ...me,
                savedBooks: me.savedBooks.filter(
                  (book:SavedBook) => book.bookId !== removeBook.bookId
                ),
              },
            },
          });
        }
        console.log('Cache after update:', cache.readQuery({ query: GET_ME }));
      } catch (err) {
        console.error('Error updating cache:', err);
      }
    },
  });

  // Handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute the REMOVE_BOOK mutation
      await removeBook({
        variables: { bookId },
      });
     
      // Remove the book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Display loading message while fetching data
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book:SavedBook) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
