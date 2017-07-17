'use strict';
const promise = require('bluebird');

const options = {
  promiseLib: promise
}

const config = {
  host: 'localhost',
  port: 5432,
  database: 'mywallet',
  user: 'postgres',
  password: 'asenhadopostgre'
};

const pgp = require('pg-promise')(options);
const db = pgp(config);

//Query functions
module.exports = {
  getAllUsers: getAllUsers,
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
  var userID = parseInt(req.params.id);
  db.one('select * from users where id = $1', userID)
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
  req.body.coins = parseInt(req.body.coins);
  db.none('insert into users(name, usr, pass, coins)' +
          'values(${name}, ${usr}, ${pass}, ${coins})',
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
  db.none('update users set name=$1, usr=$2, pass=$3, coins=$4 where id=$5',
    [req.body.name, req.body.usr, req.body.pass, paserInt(req.body.coins),
       parseInt(req.params.id)])
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
    var userID = parseInt(req.params.id);
    db.result('delete from users where id=$1', userID)
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
