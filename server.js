const express = require("express");

const bodyParser = require("body-parser");
// const { db } = require('./db/models');
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3344;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// const isAdmin = require("./middlewares/admin.middleware");
const auth=require('./middlewares/auth')


const { authRoute } = require("./routes/auth");
const { adminRoute } = require("./routes/admin");
const { customerRoute } = require("./routes/customer");

app.use("/api/auth", authRoute);
app.use("/api/admin", auth, adminRoute);
app.use("/api/customer", customerRoute);


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.listen(PORT,()=>{
  console.log("server is running at port ",PORT);
})  


