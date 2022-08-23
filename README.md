## Why

> Learn to apply functional programming patterns that transcend Express.js

Repo based on book [Functional Design Patterns for ExpressJS](https://pragprog.com/titles/d-jmexpress/functional-design-patterns-for-express-js/)

Pony Express, a simple mail server that stores emails and users. The Pony Express backend API won’t speak SMTP or IMAP like a traditional mail server, but will behave more like a conventional JSON backend API.

Server will be a pure backend API, so it will reply with JSON-formatted strings.

## Stack Used

Express
Node.js

###Middleware

- body-parser
- compression
- jsonwebtoken
- morgan
- multer
- serve-static

###Testing

- Jest
- Sinon
- SuperTest

## Getting Started

###Install

```
npm install
```

###Create file .env.local with keys and values

```
EXPIREIN=7d
SIGNATURE=s3curepasswordhere
```

###Run

To start app:

```
npm start
```

To run tests:

```
npm test
```
