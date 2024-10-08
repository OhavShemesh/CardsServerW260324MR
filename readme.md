# CardServer

## Description

CardServer is a Node.js-based server that stores and manages cards and users. It allows performing various actions on both cards and users, including retrieval, creation, editing, and deletion. Additionally, it handles user authentication and authorization, with support for business status management.

## Usage

You can interact with the CardServer either by sending requests via Postman or directly through a web interface. The available functionalities include:

### Cards:

- Get all cards or retrieve individual cards by ID.
- Create new cards.
- Edit card details.
- Delete cards.
- Like or unlike cards.
- Change the business number of a card.

### Users:

- Register new users.
- Log in existing users.
- Edit user information.
- Delete users.
- Toggle business status of a user.

## Technology Stack

The project uses the following technologies:

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **Chalk**
- **CORS**
- **Morgan**
- **Config**
- **JSON Web Token (JWT)**
- **Bcrypt**
- **Joi**

## Scripts

- `npm start`: Run the server in production mode.
- `npm run dev`: Run the server in development mode using the local MongoDB server.

## Environment Variables

The project requires a `.env` file with the following environment variables:

- `PORT`: Port number for the server.
- `DB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- Any other relevant configuration options.

## Database

CardServer uses MongoDB as its database for storing cards and user data. Ensure MongoDB is set up and running before starting the server.
