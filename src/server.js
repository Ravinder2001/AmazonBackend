const express = require("express");
const bodyParser = require("body-parser");
const connect = require("./configs/db");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 4000;
const userController = require("./controllers/users.controllers");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
app.use("", userController);
app.listen(PORT, async () => {
  await connect();
  console.log(`Listening to the port ${PORT}`);
});



// const cookieParser = require("cookie-parser");










// app.listen(port, () => {
//   console.log(`listening on ${port}`);
// });
