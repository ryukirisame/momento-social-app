import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getRelationships = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q =
      "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json(data.map((relationship) => relationship.followerUserId));
    });
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q =
      "INSERT INTO relationships(`followerUserId`, `followedUserId`) VALUES(?,?) ";

    db.query(q, [userInfo.id, req.body.userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VERIFIED, NOW LETS DO THE ACTUAL JOB
    const q =
      "DELETE FROM relationships WHERE followerUserId= ? AND followedUserId=?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("Unfollowed");
    });
  });
};
