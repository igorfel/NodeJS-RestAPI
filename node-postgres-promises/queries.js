const promise = require('bluebird');

const options = {
  promiseLib: promise
}

const config = {
  host: 'localhost',
  port: 5432,
  database: 'mywallet',
  user: 'postgres'
};

const pgp = require('pg-promise')(options);
const db = pgp(config);

//Query functions
module.exports = {
  getAllUsers: getAllUser,
  getSingleUser: getSingleUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
};

function getAllUsers(req, res, next) {
  db.any('select * from users')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved All users'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUser(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from users where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE User'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUser(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into users(name, breed, age, sex)' +
          'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          stauts: 'success',
          message: 'User Created'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUser(req, res, next) {
  db.none('update users set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'user updated'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeUser(req, res, next) {
    var pupID = parseInt(req.params.id);
    db.result('delete from users where id=$1', pupID)
      .then(function (result) {
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} user`
          });
      })
      .catch(function (err) {
        return next(err);
      });
}
