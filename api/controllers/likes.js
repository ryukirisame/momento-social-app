import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getLikes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q = "SELECT userId FROM likes WHERE postId= ? ";

    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data.map((like) => like.userId));
    });
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q = "INSERT INTO likes(`userId`, `postId`) VALUES(?,?) ";

    db.query(q, [userInfo.id, req.body.postId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post has been liked");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q = "DELETE FROM likes WHERE userId=? AND postId=?";

    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Post unliked");
    });
  });
};
