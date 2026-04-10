require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();

const authRoutes = require("./routes/auth");


const taskRoutes = require("./routes/task");

// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));
app.use("/", authRoutes);
app.use("/", taskRoutes);
// View Engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
   res.redirect("/login");
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});