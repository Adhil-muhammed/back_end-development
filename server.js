const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const jsonBodyParser = bodyParser.json();
const urlBodyParser = bodyParser.urlencoded({ extended: false });

// middileWare
app.use(cors());
app.use(jsonBodyParser);
app.use(urlBodyParser);

// helper function
const inform = (err, res) => {
  if (err) {
    return res.status(400).send({ error: "failed" });
  } else {
    return res
      .status(200)
      .send({ error: null, status: "insertion Compleated" });
  }
};

// query function

const query = (query, data = {}, res) => {
  return con.query(query, data, (err, result) => {
    inform(err, res);
  });
};

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

// get all data
app.get("/students", (req, res, next) => {
  con.query("select * from student", async (err, result, fields) => {
    if (err) throw err;
    var data = result;
    res.json(data);
  });
});

// get single data
app.get("/students/:id", (req, res, next) => {
  let { id } = req.params;
  con.query(`select * from student WHERE id =${id}`, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

// post data
app.post("/add", (req, res, next) => {
  let { firstName, lastName, place, pinCode } = req.body;
  query(
    "insert into student set ?",
    {
      firstName,
      lastName,
      place,
      pinCode,
    },
    res
  );
});

// delete data
app.delete("/remove/:id", (req, res, next) => {
  let { id } = req.params;
  con.query(`DELETE FROM student WHERE id =${id}`, (err, result, fields) => {
    if (err) {
      res.status(400);
      res.send({ error: "delete data faild" });
    } else {
      res.status(200);
      res.json({ resonse: "data removed successfully " });
    }
  });
});

// pert listen
app.listen(5000, () => {
  console.log(`server listen ${5000}`);
});
