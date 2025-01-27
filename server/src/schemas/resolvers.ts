import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js'; 
//import { Query } from 'mongoose';

// Define types for the arguments
interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
  }

interface LoginUserArgs {
    email: string;
    password: string;
  }

  interface BookArgs {  
    input:{
    bookId: string;
    authors: string[];
    title: string;
    description: string;
    image: string;
    link: string;
    }
  }


const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            const { user } = context;
            if (!user) {
                throw new AuthenticationError('Not logged in');
            }
            return User.findOne({ _id: user._id })
                .select('-__v -password')
                .populate('savedBooks');
        },
    },
    Mutation: {
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            console.log('Login resolver hit with email:', email);
            // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
      console.log('User found:', user);
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },

    addUser: async (_parent: any, { input }: AddUserArgs) => {
        // Create a new user with the provided username, email, and password
        const user = await User.create({ ...input });
        console.log('Input received:', input); // Debug input

      
        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);
      
        // Return the token and the user
        return { token, user };
      },
  

    saveBook: async (_parent: any, { input }: BookArgs, context: any) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true, runValidators: true }
          );
          return updatedUser;

        }
        throw new AuthenticationError('Could not authenticate user.');

    },
    removeBook: async (_parent: any, { bookId }: any, context: any) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updatedUser;

          if (!updatedUser) {
            throw new Error('Book not found or user not authorized');
          }
  
        }
        throw new AuthenticationError('Could not authenticate user.');
      },

  },
};

      export default resolvers;