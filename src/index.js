const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const templatePath = path.join(__dirname, '../tempelates');
const collection = require("./mongodb")
const axios = require('axios');
app.use(express.static('public'))
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatePath)
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render("login")
});
app.get("/home", (req, res) => {
    res.render("home")
});
app.get("/signup", (req, res) => {
    res.render("signup")
});
app.get("/all_customers/modal", (req, res) => {
    res.render("all_customers")
});
app.get("/header", (req, res) => {
    res.render("header")
});
app.get("/footer", (req, res) => {
    res.render("footer")
});
//get data from database
app.get("/all_customer", (req, res) => {
    collection.find()
        .then(customer => {
            res.send(customer)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "err occurred while retriving user info" })
        })
})
app.get("/all_customers", (req, res) => {
    //get request to api/user
    axios.get('http://localhost:3000/all_customer').then(function (response) {
        console.log(response.data);
        res.render("all_customers", { users: response.data })
    })
        .catch(err => {
            res.send(err);
        })
});

app.put("/all_customer/:id", (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cant be empty" })
    }
    const id = req.params.id;
    collection.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `cannot update by ${id}` })
            } else {
                res.send(data)
            }
        }).catch(err => {
            res.status(500).send({ message: "err update user info" })
        })
})
app.put("/all_customers", (req, res) => {
    axios.get('http://localhost:3000/all_customer', { params: { id: req.query.id } })
        .then(function (userdata) {
            res.render("all_customers/modal", { user: userdata.data })
        })
        .catch(err => {
            res.send(err);
        })
})

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password

    }
    await collection.insertMany([data])
    res.render("home")
})

app.post("/login", async (req, res) => {

    try {
        const check = await collection.findOne({ name: req.body.name })
        if (check.password === req.body.password) { res.render("home") }
        else {
            res.send("wrong password")

        }
    } catch {
        res.send("wrong details")


    }

})

app.listen(3000, () => {
    console.log("port connected");
});


