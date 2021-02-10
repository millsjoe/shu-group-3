const express = require('express');
const googleAPIs = require('../places');
const router = express.Router();
const bodyParser = require("body-parser");

let max = 5;
let shops = [];
router.get('/', (req, res) => res.render('index'));

router.get('/home', (req, res) => {
    res.render('home');
});

module.exports = router;
// const Users = {
//   "admin": "admin", // password is admin
//   "chris": "chris", // password is chris
//   "tom": "tom", // password is tom
// }

const Users = {

};

const doesUserExist = function (username) {
  return username in Users;
};

getUsersPassword = function (username) {
  if (doesUserExist(username)) {
    return Users[username];
  } else {
    console.log(`Getting a password on a user that doesn't exist: ${username}`);
    throw "FATAL ERROR: Getting a password on a user that doesn't exist";
  }
};

const checkUserPassword = function (username, password) {
  // return password == getUsersPassword(username)
  return hashString(password) == getUsersPassword(username);
};

const hashString = function (string) {
  return crypto.createHash("sha256").update(string).digest("hex");
};

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

// const port = 3000;

// app.get("/", (req, res) => {
//   res.send('Hello World! Click <a href="/login">Login</a> to Login');
// });

// app.get("/login", (req, res) => {
//   res.sendFile("login.html", { root: path.join(__dirname, "public") });
// });

// app.get("/secret", function (request, response) {
//   if (request.session.loggedin) {
//     response.send("Welcome back, " + request.session.username + "!");
//   } else {
//     response.send(
//       'Please login to view this page! Click <a href="/login">Login</a> to Login'
//     );
//   }
//   response.end();
// });

// app.post("/login", (request, response) => {
//   const username = request.body.username;
//   const password = request.body.password;

//   console.log(`The user ${username} is trying to login`);

//   if (doesUserExist(username)) {
//     console.log(`The user ${username} is a valid user`);

//     if (checkUserPassword(username, password)) {
//       console.log(`Password correct`);
//       request.session.loggedin = true;
//       request.session.username = username;
//       return response
//         .status(201)
//         .send(
//           'Password Correct. Click <a href="/secret">secret</a> to see the secret content'
//         );
//     } else {
//       console.log(
//         `The user's ${username} is correct, but an invalid password was supplied`
//       );
//       return response.status(403).send("Password incorrect");
//     }
//   } else {
//     console.log(`The user ${username} is an invalid user`);
//     return response.send("User does not exist", 403);
//   }
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
router.post('/', (req, res) => {
    const { postCode } = req.body;
    setLocalShops(postCode);
    const shopsToReturn = getLocalShops(max);
    res.render('shops', {shops: shopsToReturn});
});

router.post('/shops', (req, res) => {
    increaseLimit();
    const shopsToReturn = getLocalShops(max);
    res.render('shops', {shops: shopsToReturn});
});

module.exports = router;

function setLocalShops(postcode) {
    shops = googleAPIs.getCoffeeShops(postcode);
}

function getLocalShops(numShops) {
    // console.log(shops.slice(1,numShops));
    return shops.slice(1,numShops);
}

function increaseLimit() {
    if (max <= shops.length){
        max += 5;
    }
}
