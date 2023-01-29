import { con } from "../server.js";
import bcrypt from "bcrypt";

export const addUsers = (data, res) => {
  const { user_name, password, gender } = data;
  const sql = "insert into users set ?";
  const sql1 = "select * from users where user_name= ? ";
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  con.query(sql, { user_name, password: hash, gender }, (err, result) => {
    if (err) {
      res.status(400).send({ error: err.message });
    }
  });
  con.query(sql1, user_name, (err, result) => {
    if (err) {
      console.log("err", err);
      res.status(400).send({ message: "error occured" });
    } else {
      res.send(result);
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
