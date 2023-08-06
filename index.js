const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://idealize-frontend.onrender.com",
      "https://www.idealize.raguraj.me",
      "https://www.idealize.mathesh.me"
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
function addVersionInfo(apiEndPoint) {
  const versionHeader = "/api/v1";
  return versionHeader + apiEndPoint;
}

app.use(addVersionInfo("/authentication"), require("./routes/authentication"));
app.use(addVersionInfo("/users"), require("./routes/users"));
app.use(addVersionInfo("/teams"), require("./routes/teams"));
app.use(addVersionInfo("/projects"), require("./routes/projects"));
app.use(addVersionInfo("/todo"), require("./routes/todo"));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_LOCAL_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.json({
    message: "Node Server running on  port " + process.env.PORT,
    address: `${req.protocol}://${req.get('host')}`
  });
});

app.listen(process.env.PORT, () => {
  console.log("Node Server running on  port " + process.env.PORT);
});
