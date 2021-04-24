const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/scrip-draft'));
// Start the app by listening on the default
// Heroku port
console.log("__dirname", __dirname);
console.log("env port", process.env.PORT);
let port = process.env.PORT || 8080
app.listen(process.env.PORT || 8080);
console.log("listening on port " + port)