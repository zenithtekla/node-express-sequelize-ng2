**INSTRUCTION**


Pre-requisite: Install typings globally if you haven't already, _$ npm i -g typings_

1- start off by doing _$ npm i_

2- If everything works you should be able to exec _$ npm run dev_

   That command is used for development


3. For production,
do the following for once to update to the latest build if necessary _$ gulp_

then the server can start anytime with _$ npm start_

Visit `localhost:3000` to see link to the application through BrowserSync
or `localhost:4000` to directly view the application.

Packages included:
- node-angular2 seed for appDev
- gulp-nodemon-browserSync
- hbs
- ExpressJS server for back-end dev
- cors
- Sequelize
- epilogue
- continuous migration of Sequelize and some good back-end stuffs, RESTful API and CRUD operations done previously from NodeMYSQL repo.
- mocha, chai, supertest
  - Mocha is a test framework while Chai is an expectation one
  - These two, alongside with Jasmine and Karma facilitate TDD (Test-Driven Development) and BDD (Behavior-Driven Development)
- Port in use: 3000, 3001, 3002 (BrowserSync UI), 4000