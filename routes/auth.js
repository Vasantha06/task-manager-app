const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Signup Page
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Signup Logic
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.redirect("/login");
});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Login Logic
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.send("Wrong password");
    }

    req.session.userId = user._id;
    res.redirect("/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;