ssimport { query } from "../server.js";

import { con } from "../server.js";
import bcrypt from "bcrypt";

export const addUsers = (data, res) => {
  const { user_name, password, gender } = data;
  console.log("password", password);
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
