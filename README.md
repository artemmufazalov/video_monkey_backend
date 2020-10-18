# Video Monkey server

It is a backend part for [Video Monkey Website](https://artemmufazalov.github.io/video_monkey).

Frontend github repository: https://github.com/artemmufazalov/video_monkey

The server is currently running on Heroku, the app data is stored in MongoDB Atlas Cluster.

It was made using following stack of technologies:
* Node.js
* Express.js, MongoDB, mongoose
* nodemon, nodemailer, jwt
* ...other smaller libs
### Run repository on your computer
Use git clone command to download source code to your computer
```
git clone https://github.com/artemmufazalov/video_monkey_backend.git
```
Then use `npm install` to install all necessary modules to run the app
```
npm install
```
## Configs
To run this app you need first initialize configuration variables in .env file, that by default should be located in src/configs.
Those variables include Nodemailer, MongoDB and JWT configs, general server settings.
Sample .env file:
### `general settings`
```
NODE_ENV=development / production
PORT=port number (e.g. to run the app on http://localhost:5000 should be set to 5000)
FRONTEND_ORIGIN=the url of your website (e.g. http://localhost:3000)
```
### `jwt configs`
```
JWT_KEY=your jwt key
JWT_MAX_AGE=your desired jwt expiration time (7d - 7 days)
```
### `Nodemailer configs`
```
NODEMAILER_HOST=email host uri (e.g. smtp.gmail.com)
NODEMAILER_SERVICE_NAME=service name (e.g. gmail)
NODEMAILER_USER=your service user name or email address
NODEMAILER_PASS=your password
NODEMAILER_PORT=port number
```
### `MongoDB configs`
```
MONGODB_URI=url to access your remote MongoDB instance
```
For the production build variables will be initialized as environment variables.
## Available Scripts

In the project directory, you can run:

### `npm run start_dev`

Runs a development server on localhost://(port number in configuration file).
The env configs will be uploaded from the .env file in the project directory

The app uses nodemon, so it will automatically reload if you make any edits.

### `npm run start`

Runs production server, where variables should be initialized as environment variables
