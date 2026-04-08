const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Middleware (check login)
function isLoggedIn(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// Dashboard (View Tasks)
router.get("/dashboard", isLoggedIn, async (req, res) => {
    const search = req.query.search || "";
    const status = req.query.status;

    let query = {
        userId: req.session.userId,
        title: { $regex: search, $options: "i" }
    };

    if (status) {
        query.status = status;
    }

    const tasks = await Task.find(query);

    res.render("dashboard", { tasks });
});

// Add Task
router.post("/add-task", isLoggedIn, async (req, res) => {
    const { title, description, dueDate } = req.body;

    await Task.create({
        title,
        description,
        dueDate,
        userId: req.session.userId
    });

    res.redirect("/dashboard");
});

// Show Edit Form
router.get("/edit/:id", isLoggedIn, async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render("edit", { task });
});

// Update Task
router.post("/edit/:id", isLoggedIn, async (req, res) => {
    const { title, description, dueDate } = req.body;

    await Task.findByIdAndUpdate(req.params.id, {
        title,
        description,
        dueDate
    });

    res.redirect("/dashboard");
});


// Delete Task
router.get("/delete/:id", isLoggedIn, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
});

// Update Task Status
router.get("/update/:id", isLoggedIn, async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, {
        status: "Completed"
    });
    res.redirect("/dashboard");
});

module.exports = router;