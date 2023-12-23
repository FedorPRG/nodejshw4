const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'usersData.json');

const userScheme = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  age: Joi.number().min(0).required(),
  city: Joi.string().min(3),
});

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
  res.send({ users });
});

app.get('/users/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
  const user = users.find((user) => user.id === +req.params.id);
  if (user) {
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

app.post('/users', (req, res) => {
  const result = userScheme.validate(req.body);
  if (result.error) {
    return res.status(500).send({ error: result.error.details });
  }
  const users = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
  let uId = 0;
  if (users) {
    uId = +users[users.length - 1].id + 1;
  }
  users.push({
    id: uId,
    ...req.body
  });
  fs.writeFileSync(pathFile, JSON.stringify(users));
  res.send({ id: uId });
});

app.put('/users/:id', (req, res) => {
  const result = userScheme.validate(req.body);
  if (result.error) {
    return res.status(500).send({ error: result.error.details });
  }
  const users = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
  const user = users.find((user) => user.id === +req.params.id);
  if (user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.city = req.body.city;
    fs.writeFileSync(pathFile, JSON.stringify(users));
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

app.delete('/users/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
  const user = users.find((user) => user.id === +req.params.id);
  if (user) {
    const userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    fs.writeFileSync(pathFile, JSON.stringify(users));
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

app.listen(3000);