import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment/moment.js";

export const getPosts = (req, res) => {
  console.log(req.query);
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // LOGIN CREDENTIALS ARE VALID SO LETS PROCEED TO THE ACTUAL JOB

    const userId = req.query.userId;

    const q =
      userId !== "undefined"
        ? "SELECT p.*, u.id AS userId, name, profilePic FROM posts p INNER JOIN users u ON (u.id=p.userId) WHERE p.userId= ? ORDER BY p.createdAt DESC"
        : `SELECT DISTINCT p.*, u.id AS userId, name, profilePic FROM posts AS p INNER JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        ORDER BY p.createdAt DESC`;

    // console.log(q);

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      // console.log(data);

      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // LOGIN CREDENTIALS ARE VALID SO LETS PROCEED TO THE ACTUAL JOB

    const q =
      "INSERT INTO posts (`desc`, `img`, `userId`, `createdAt`) VALUES(?, ? , ?, ?)";

    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM--DD HH:mm:ss"),
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // LOGIN CREDENTIALS ARE VALID SO LETS PROCEED TO THE ACTUAL JOB

    const q = "DELETE FROM posts WHERE id= ? AND userId= ?";

    const values = [req.params.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.affectedRows === 0)
        return res.status(403).json("You cannot delete someone elses post");
      return res.status(200).json("Post has been deleted");
    });
  });
};
export const updatePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // LOGIN CREDENTIALS ARE VALID SO LETS PROCEED TO THE ACTUAL JOB

    if (userInfo.id !== req.body.userId)
      return res.status(403).json("You cannot update someone elses post");

    const q = "UPDATE posts SET `desc`= ?, `img` = ? WHERE `id` = ? ";

    const values = [req.body.desc, req.body.img, req.body.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.affectedRows === 0)
        return res.status(403).json("You cannot delete someone elses post");

      return res.status(200).json("Post has been updated");
    });
  });
};
