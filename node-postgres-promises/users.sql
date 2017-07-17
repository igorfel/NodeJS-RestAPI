DROP DATABASE IF EXISTS mywallet;
CREATE DATABASE mywallet;

\c mywallet;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  usr VARCHAR,
  pass VARCHAR,
  coins MONEY
);

INSERT INTO users (name, usr, pass, coins)
  VALUES ('Administrador', 'adm', 'pass1', 0);
