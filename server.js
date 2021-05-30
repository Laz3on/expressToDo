const express = require("express");
const app = express();
const kenx = require("knex");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const db = kenx({
    client: "pg",  // postgres
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "password",
        database: "dbname"
    }
});

// route to the root
app.get('/', (req, res) => {
    db.select("*").from("task").then(data => {
        res.render("index", { todos: data });
    }).catch(err =>
        res.status(400).json(err));
});

// server port connection
app.listen(8080, () =>
    console.log('app is running on port 8080'));

// set template engine
app.set('view engine', 'ejs');

// create new task
app.post("/addTask", (req, res) => {
    const { textTodo } = req.body;
    db("task").insert({ task: textTodo }).returning("*")
        .then(_ => {
            res.redirect("/");
        }).catch(err => {
            res.status(400).json({
                message: "unable to create a new task"
            });
        });
});