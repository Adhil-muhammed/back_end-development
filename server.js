const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const jsonBodyParser = bodyParser.json();
const urlBodyParser = bodyParser.urlencoded({ extended: false });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Adhil@123",
  database: "db",
});

con.connect((err) => {
  if (err) console.log(err);
  console.log("connected");
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
  } else if (result.length > 1) {
    res.send(result);
  } else {
    return res
      .status(200)
      .send({ error: null, status: "successfully compleated" });
  }
};

// query function
const query = (query, data, res) => {
  return con.query(query, data, (err, result) => {
    inform(err, res, result);
  });
};

// get all data....
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

// get single data
app.get("/student/:id", (req, res, next) => {
  let { id } = req.params;

  con.query(`select * from student WHERE id =?`, id, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

// post data
app.post("/add", (req, res, next) => {
  let sql = "insert into student set ?";
  query(sql, req.body, res);
  console.log("hghgh");
  console.log("hi");
});

// update data
app.patch("/student/:id", (req, res, next) => {
  let { id } = req.params;
  let sql = `UPDATE student set ? WHERE id=?`;
  query(sql, [req.body, id], res);
});

// delete data
app.delete("/student/:id", (req, res, next) => {
  let { id } = req.params;
  let sql = `DELETE FROM student WHERE id =?`;
  query(sql, id, res);
});

// pert listen
app.listen(5000, () => {
  console.log(`server listen ${5000}`);
});
