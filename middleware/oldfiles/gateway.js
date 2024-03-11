require("dotenv").config();
const express = require("express")
const cors = require("cors");
const bodyParser = require('body-parser');

// import auth middleware
const { protect } = require("./auth");
// import rateLimiter middleware
const { rateLimiter } = require("../ratelimiter/ratelimiter");
// import logging middleware
const logging = require("../logging/logging");



// const secret = process.env.SESSION_SECRET;
const app = express();
const port = 3000;
  
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(
  session({
    secret : 'test',
    resave: true,
    saveUninitialized: false,
    store,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 60000,
      sameSite: "none",
    },
  })
);

app.set('trust proxy', 1) 
app.use('/', routes);
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(logging);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  const { authenticated } = req.session;
  console.log("Home Page");
  if (!authenticated) {
    // res.send("Not authenticated redirecting to /login...");
    // redirect to login page
    res.redirect("/login");
  } else {
    res.send("Already authenticated ");
  }
});


app.get("/login", protect, (req, res) => {
    const { authenticated } = req.session;
    if (!authenticated) {
      res.send("Please Login");
    } else {
      req.session.save();
      res.send("Already authenticated");
    }
  });
  
app.get("/logout", protect, (req, res) => {
  req.session.destroy(() => {
    res.send("Successfully logged out");
  });
});

app.get("/protected", protect, (req, res) => {
  const { name = "user" } = req.query;
  res.send(`Hello ${name}!`);
});