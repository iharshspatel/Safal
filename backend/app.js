const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const errorMiddleware = require("./middleware/error")
const path = require("path")

app.use(express.json())
app.use(cookieParser())

//  Route Imports
const test = require("./routes/testRoute")
const user = require("./routes/userRoute")
const branch = require("./routes/branchRoute")
const architect = require("./routes/architectRoute")
const mistry = require("./routes/mistryRoute")
const dealer = require("./routes/dealerRoute")
const pmc = require("./routes/pmcRoute")
const customer = require("./routes/customerRoute")
const salesman = require("./routes/salesmanRoute")
const inquiry = require("./routes/inquiryRoute")
const task = require("./routes/taskRoute")

app.use("/api/v1", test)
app.use("/api/v1", user)
app.use("/api/v1/architect", architect)
app.use("/api/v1/branch", branch)
app.use("/api/v1/mistry", mistry)
app.use("/api/v1/dealer", dealer)
app.use("/api/v1/pmc", pmc)
app.use("/api/v1/customer", customer)
app.use("/api/v1/inquiry", inquiry)
app.use("/api/v1/salesman", salesman)
app.use("/api/v1/task", task)


app.use(express.static(path.join(__dirname, "../frontend/build")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
})
// Middleware for Errors
app.use(errorMiddleware)


module.exports = app