
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");
const app = express();
// app.use(bodyParser.urlencoded({ extended: false })); //To Parse the url encoded data
// app.use(bodyParser.json());
app.use(express.json());
app.use("/blog", blogRouter);
app.use(router);
let connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/BlogApp", {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    });
    console.log("DB connected");
    app.listen(8000, () => {
      console.log("server running at port 8000");
    });
  } catch (err) {
    console.log("ERROR🤬", err);
  }
};

connectDB();
