require("dotenv").config();

const express = require("express");
const authentication = require("./middlewares/authentication");
const errorHandler = require("./middlewares/errorHandler");
const UserController = require("./controllers/userController");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.post("/loginL", UserController.loginLinkedIn);

app.use(authentication);

app.get("/users", UserController.allUser);
app.get("/users/:id", UserController.findUser);
app.delete("/users/:id", UserController.deleteUser);

app.get("/people", UserController.getDataPerson);
app.get("/people/:id", UserController.getDataPersonById);
app.patch("/people/:id", UserController.updateDataPerson);
app.patch("/people/:id", UserController.updateDataPerson);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
