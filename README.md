# Video Monkey server

It is a backend part for [Video Monkey Website](https://artemmufazalov.github.io/video_monkey).

It was made using following stack of technologies:
* Node.js
* Express.js, MongoDB, mongoose
* nodemon, nodemailer, jwt

### Run repository on your computer
Use git clone command to download source code to your computer.
```
git clone https://github.com/artemmufazalov/video_monkey_backend.git
```
Then use `npm install` to install all necessary modules to run the app.
```
npm install
```
## Configs
To run this app you need first initialize env variables in .env file, that by default should be located in src/configs.<br>
Those variables include Nodemailer configs, configs for JWT and general server settings.<br>
Sample .env file:
### `general settings`
```
PORT=port number (e.g. to run the app on localhost://5000 should be set to 5000)
```
### `jwt configs`
```
JWT_KEY=your jwt key
JWT_MAX_AGE=your desired jwt expiration time
```
### `Nodemailer configs`
```
NODEMAILER_HOST=email host uri
NODEMAILER_SERVICE_NAME=service name
NODEMAILER_USER=your service user name or email address
NODEMAILER_PASS=your password
NODEMAILER_PORT=port number
```
## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs a development server on localhost://(port number in .env file).

The app uses nodemon, so it will automatically reload if you make any edits.
