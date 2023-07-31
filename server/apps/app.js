const express = require("express");
const app = express();
const port = process.env.PORT || 3002;
const cors = require('cors')
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { run } = require("./config/config");


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.use(router)
app.use(errorHandler)

run().then(() => {
  app.listen(port, () => {
    console.log(
      `SeekerDB app listening on port ${port} -- ${new Date().toLocaleDateString()}`
    );
  });
});