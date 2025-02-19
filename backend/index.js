const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db');
const passport = require('passport')
const expressSession = require('express-session')

const app = express();
const PORT = 8000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(expressSession({secret:'insightznumba1', resave:false, saveUninitialized: false}));

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Fetch users from database
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/api/addstudent", (req, res) => {
    const sql = "INSERT INTO students (name, email, username, password) VALUES (?,?,?,?)";

    const values = [req.body.name,req.body.email, req.body.username, req.body.password] ;

    db.query(sql, values, (err, result) => {
        if (err)
            return res.json({message: "Something unexpected has occured" + err});
        return res.json({success: "New User added successfully"});
    });
})

app.get("/api/getuser/:id", (req, res) =>{
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if(err) res.json ({message: "Server error"});
    return res.json(result)
  })
})

app.put("/api/edit/:id", (req,res) => {
  const id = req.params.id;
  const sql = "UPDATE students SET name=?, email=?, username=? WHERE id=?";

  const values = [
    req.body.name,
    req.body.email,
    req.body.username,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if(err)
      return res.json({message:"Something unexpected has occured" + err})
    return res.json({success:"User updated successfully"})
  })
})

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM students WHERE id=?";
  const values = [id];

  db.query(sql, values, (err, result) => {
    if(err)
      return res.json({message:"Something unexpected has occured" + err})
    return res.json({success:"User deleted successfully"})
  })
})

//Register
app.post("/api/register", (req, res) => {
  const sql = "INSERT INTO users(username, email,  password) VALUES (?,?,?)";

  const values = [ req.body.username, req.body.email, req.body.password] ;

  db.query(sql, values, (err, result) => {
      if (err)
          return res.json({message: "Something unexpected has occured" + err});
      return res.json({success: "New User added successfully"});
  });
})

//Login

app.post('/api/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error during authentication");
    }
    
    if (!user) {
      return res.status(401).send("User not found");
    }

    // You had !user here which is incorrect - it should be a positive check
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error logging in");
      }
      console.log(user);
      res.send("success");
    });
  })(req, res); // Don't forget to call the authenticate function with req, res
});

app.get('/api/getUser', (req, res) => {
  res.send(req.user);
  console.log(req.user);
})


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
