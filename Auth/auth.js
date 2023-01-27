<<<<<<< HEAD
import { con } from "../server.js";
import bcrypt from "bcrypt";

export const addUsers = (data, res) => {
  const { user_name, password, gender } = data;
  const sql = "insert into users set ?";
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  con.query(sql, { user_name, password: hash, gender }, (err, result) => {
    if (err) {
      res.status(400).send({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(200).send({ error: null, data: [] });
    } else {
      res.status(200).send({ error: null, user_id: result.insertId });
    }
  });
};

export const getUsers = (res) => {
  const sql = "select * from  users";
  con.query(sql, (err, result) => {
    if (err) {
      res.status(400).send({ error: err.message });
    } else {
      res.status(200).send({ error: null, result });
    }
  });
};

export const login = async (req, res) => {
  let { user_name, password } = req.body;
  let sql = `select * from  users WHERE user_name= '${user_name}'`;

  con.query(sql, (err, result) => {
    const isPassword =
      result.length === 0
        ? false
        : bcrypt.compareSync(password, result[0]?.password);

    if (!isPassword) {
      return res
        .status(400)
        .send({ error: "password or user name  is invalid" });
    } else {
      return res.status(200).send({ error: null, data: result });
    }
  });
};
=======
// const app = require("express");
// const query = require("../server.js");

// const register = (req, res) => {
//   console.log(req);
//   const sql = "insert into table users value set (?)";
//   query(sql, [req.body], res);
// };

// module.exports = register();
>>>>>>> 3dc73c5 (create registration api)
