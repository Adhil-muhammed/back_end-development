import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import { addUsers, getUsers, login } from "./Auth/auth.js";

const app = express();

const jsonBodyParser = bodyParser.json();
const urlBodyParser = bodyParser.urlencoded({ extended: false });

export var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Adhil@123",
  database: "db",
});

con.connect((err) => {
  if (err) console.log(err);
  console.log("connected");
});

// port listen
app.listen(5000, () => {
  console.log(`server listen ${5000}`);
});

// middileWare
app.use(cors());
app.use(jsonBodyParser);
app.use(urlBodyParser);

// get reponce
const inform = (err, res, result) => {
  if (err) {
    console.log(err);
    return res.status(400).send({ error: "failed", message: err.message });
  } else if (result.length === 0 || result.affectedRows === 0) {
    res.send({ result: [] });
  } else {
    return res.status(200).send({ error: null, data: result });
  }
};

// query function
export const query = (query, data, res) => {
  return con.query(query, data, (err, result) => {
    inform(err, res, result);
  });
};

// get all student....
app.get("/students", (req, res, next) => {
  con.query("select * from student", async (err, result, fields) => {
    err
      ? res
          .status(400)
          .send({ error: "can not get data", status: "process denied " })
      : res.status(200).send({
          error: null,
          status: "successfully compleated",
          data: result,
        });
  });
});

// get single student
app.get("/student/:id", (req, res, next) => {
  let { id } = req.params;

  con.query(`select * from student WHERE id =?`, id, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

// post student data
app.post("/students", (req, res, next) => {
  let sql = "insert into student set ?";
  query(sql, req.body, res);
});

// update student data
app.patch("/student/:id", (req, res, next) => {
  let { id } = req.params;
  let sql = `UPDATE student set ? WHERE id=?`;
  query(sql, [req.body, id], res);
});

// delete student
app.delete("/student/:id", (req, res, next) => {
  let { id } = req.params;
  let sql = `DELETE FROM student WHERE id =?`;
  query(sql, id, res);
});

// get all student marks on subject
app.get("/marks/student", (req, res, next) => {
  let sql = "SELECT * from student JOIN marks ON student.id=marks.student_id";
  con.query(sql, (err, result) => {
    err
      ? res.status(400).send({ error: err.message })
      : res.status(200).json({
          error: null,
          status: "successfully compleated",
          data: result,
        });
  });
});

// add mark into student
app.post("marks/student/:studentId", (req, res) => {
  // coming soon..........
});

// get user
app.get("/users/:id", (req, res) => {
  const sql = "select * from users WHERE id=?";
  getUsers(sql, req.params.id, res);
});

// login user
app.post("/login", (req, res) => login(req, res));
