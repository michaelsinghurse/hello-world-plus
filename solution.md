# Hello World+

## Technology Chosen
- Backend
  - Node.js
  - Express.js framework for routing and middleware
  - `pg` library for connecting to db
  - `express-session` and `pg-simple-session` for sessions
  - `morgan` for logging
  - `nodemon` for dev live reloading
  - `dotenv` for environmental variables
  - `axios` for fetching the name-meaning website
  - `cheerio` for parsing the html returned
- Database
  - PostgreSQL for users, name data, and sessions
- Frontend
  - React.js

Note:
- The reason I chose Node.js for the backend is because it is
what I am most familiar with. Node stands out for async programming
and heavy I/O uses cases like a real-time chat or gaming. This
hello world plus app is just a simple CRUD app and so any back-end
language would do.

## Features
- [X] A user can submit their name and be greeted by name
- [X] Store in a normalized database timestamp and client IP that submits 
each name
- [X] Screen scrape name meanings. Display no more than 100 chars with a 
link to learn more. Store meaning in db. Provide mode to turn off db
storing of name meaning for dev purposes.
- [X] History area of page that displays last 10 names submitted. Allow
users to control how many names to display
- [ ] Sessions. Store the last name a user submitted so they will
be greeted by name if they return. Display session ID on page. Provide
a way for user to destroy the session.
- [ ] Clearning stats. Provide a way to clear history from the DB both
from the web interface and the command line.

## Other
- Avoid obvious security mistakes
- Testing. Test coverage report as a bonus.

