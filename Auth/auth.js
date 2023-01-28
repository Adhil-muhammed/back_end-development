import { query } from "../server.js";

export const getUsers = (sql, data, res) => {
  query(sql, data, res);
};
