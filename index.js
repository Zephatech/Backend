const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const register = require('./register')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', (req, res) => { const id = parseInt(req.params.id); return db.getUserById(id)})
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.get('/register', (req, res) => {
  res.send(`
    <h1>注册页面</h1>
    <form action="/register" method="POST">
      <input type="text" name="FirstName" placeholder="First Name" required>
      <input type="text" name="LastName" placeholder="Last Name" required>
      <input type="password" name="password" placeholder="password" required>
      <input type="password" name="cPassword" placeholder="Confirm password" required>
      <input type="email" name="email" placeholder="email" required>
      <button type="submit">注册</button>
    </form>
  `);
});

app.post('/register', (req, res) => {
  const { FirstName, LastName, password, cPassword,email } = req.body;

  // Check if the user already exists
  if (unverifiedUsers[email]) {
    return res.send('Email already registered.');
  }

  
  registeredUsers[username] = { username, password };

   
  res.send('register success!');
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})