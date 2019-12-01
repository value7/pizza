const express = require('express');
const path = require('path');
const app = express();
var bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

//postgres and authentication stuff
const jwt = require('jsonwebtoken');

var cookieParser = require('cookie-parser');
const url = require('url');

//encription
var bcrypt = require('bcryptjs');
const saltRounds = 10;

let db = new sqlite3.Database('./db/pizza.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app
  .use(express.static(path.join(__dirname, '/client/build')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

app.set('superSecret', "config.secret");

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// get all pizzerias
app.get('/api/pizzeria/getAll', (req, res) => {
  db.all(`SELECT p.id, p.name, p.addresse, p.website, avg(r.rating) as rating
          from pizzerias as p
          left join ratings as r
            on r.pizzeriaId = p.id
          group by p.id, p.name, p.addresse, p.website`, (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    console.log(rows);
    res.send({pizzerias: rows});
  });
});

app.get('/api/pizzeria/getDetails/:name', (req, res) => {
  db.all(`SELECT p.id, p.name, p.addresse, p.website, avg(r.rating) as rating
          from pizzerias as p
          left join ratings as r
            on r.pizzeriaId = p.id
          where name = (?)
          group by p.id, p.name, p.addresse, p.website`, [req.params.name], (err, rows) => {
    if(err) {
      console.log(err)
    } else {
      res.send({pizzeria: rows[0]});
    }
  })
})

app.post('/api/users/signup', function(req, res) {
  //save the username and password
  //encrypt the password
  console.log(req.body);
  var encryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);
  console.log(encryptedPassword);
  //check if username is taken
  //database throws an error because of the username unique constraint
  db.run(
    'insert into users (name, password) VALUES (?, ?)', [req.body.name, encryptedPassword], function(err, result) {
    console.log(err);
    console.log(result);
    console.log(this.lastID);
    if(!err) {
      //succesfull insert log the user in

      var jwtUser = {
        "name": req.body.username,
        "scope": "rando",
        "id": this.lastID
      }
      var token = jwt.sign(jwtUser, app.get('superSecret'), {
        expiresIn: 1440 //24h
      });
      //signup so empty votes
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        user: req.body.name,
        scope: "rando",
        isAdmin: false
      });
    } else {
      res.status(303).send({success: false, message: 'the username is already taken'});
    }
  });
})

// log in
//authenication
app.post('/api/authenticate', function(req, res) {
  console.log('in authenticate api thingy');
  // console.log(req.body);
  //TODO check that username and password are correctly set
  //find the user
  console.log(req.body.name);
  db.get(
    `
    select id, name, password from users where name = (?)
    `, [req.body.name], function(err, rows) {
      if (err) throw err;
      console.log(err);
      console.log(rows);
      //check if user is found
      if(typeof rows === 'undefined') {
        console.log('user not found');
        //TODO send error to raise if error
        res.status(303).send({success: false, message: 'User not found'});
      } else {
        console.log('user found');
        //check if password is correct
        if(!bcrypt.compareSync(req.body.password, rows.password)) {
          console.log('WRONG PASSWORD');
          //TODO send error to raise if error
          res.status(303).send({password: 'wrong password'});
        } else {
          console.log('password correct');
          var jwtUser = {
            "name": rows.name,
            "scope": "rando",
            "id": rows.id
          }
          var token = jwt.sign(jwtUser, app.get('superSecret'), {
            expiresIn: 1440 //24h
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            user: rows.name,
            scope: "rando"
          });
        }
      }
    }
  )
});

//authentication middleware
//routes which are declared after this can only be accessed with a valid jwt
app.use('/api', function(request, response, next) {
  //check header or url paramaters or post paramaters for token
  console.log('in authentication middleware');
  //console.log(request);
  // console.log(request.cookies);
  //console.log(request.cookies);
  var token = request.body.token || request.query.token || request.headers['x-access-token'];
  //console.log(token);
  if(!token && request.cookies && request.cookies.token) {
    //console.log('Getting token from cookie');
    //TODO will probably fail with a cookie without token
    token = request.cookies.token;
  }
  console.log(token);
  //decode token
  if(token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if(err) {
        console.log('failed to authenticate token');
        return response.status(403).json({ error: true, message: 'Failed to authenticate token.' });
      } else {
        request.decoded = decoded;
        console.log(decoded);
        console.log('authenticated');
        next()
      }
    });
  } else {
    console.log('access denied');
    return response.status(403).send({
      error: true,
      message: 'No token provided'
    });
  }
});

app.get('/api/users/:username', (req, res) => {
  console.log(req.params.username);
  console.log(req.decoded);
  // check if it's his own profile page
  if(!req.params.username === req.decoded.name) {
    return response.status(403).json({ error: true, message: 'not your own profile page' });
  } else {
    db.all(`SELECT id, name from users where id = (?)`, [req.decoded.id], (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      console.log(rows);
      res.send({user: rows[0]});
    });
  }
})

app.post('/api/pizzeria/add', (req, res) => {
  // check if it's his own profile page
  if(req.body.name && req.body.addresse && req.body.link) {
    db.run(
      'insert into pizzerias (name, addresse, website) VALUES (?, ?, ?)', [req.body.name, req.body.addresse, req.body.link], function(err, result) {
      console.log(err);
      console.log(result);
      console.log(this.lastID);
      if(!err) {
        //signup so empty votes
        res.json({
          success: true,
          message: 'restaurant submitted',
          name: req.body.name
        });
      } else {
        res.status(303).send({success: false, message: 'the name addresse or link was already submitted'});
      }
    });
  } else {
    return res.status(403).json({ error: true, message: 'one or more fields missing' });
  }
})

app.post('/api/rating/add', (req, res) => {
  if(req.body.pizzeriaId && req.body.rating) {
    db.run(`
      insert into ratings (userId, pizzeriaId, rating) values (?, ?, ?)
      `, [req.decoded.id, req.body.pizzeriaId, req.body.rating], function(err, result) {
        if(!err) {
          res.json({
            success: true,
            message: 'succesfully rated'
          })
        } else {
          res.status(303).send({success: false, message: 'an error occurred while rating'});
        }
      })
  }
})
