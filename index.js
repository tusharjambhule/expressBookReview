const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

const general = require("./router/general").general;
const customer = require("./router/auth_users").authenticated;

app.use("/", general);
app.use("/customer", customer);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});