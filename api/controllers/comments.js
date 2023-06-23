import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import moment from "moment";

export const getComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT c.*, u.name, u.profilePic FROM comments c INNER JOIN users u ON c.userId=u.id WHERE postId=? ORDER BY c.createdAt DESC";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // LOGIN CREDENTIALS ARE VALID SO LETS PROCEED TO THE ACTUAL JOB

    const q =
      "INSERT INTO comments(`desc`, `postId`, `userId`, `createdAt`) VALUES(?, ? , ? , ?)";

    const values = [
      req.body.desc,
      req.body.postId,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM--DD HH:mm:ss"),
    ];

    // console.log(values);

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Comment has been created");
    });
  });
};
