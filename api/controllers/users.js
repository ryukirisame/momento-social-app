import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "SELECT * FROM users WHERE id=?";

    const userId = req.params.userId;

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      const { password, ...others } = data[0];

      return res.status(200).json(others);
    });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // USER VALIDATED, NOW LETS DO THE ACTUAL JOB

    const q =
      "UPDATE users SET `name`= ?, `coverPic`= ?, `profilePic`= ?, `city`=?, `website`=?, `facebook`=?, `instagram`=?, `twitter`=?, `linkedin`=? WHERE `id`=?";

    const values = [
      req.body.name,
      req.body.coverPic,
      req.body.profilePic,
      req.body.city,
      req.body.website,
      req.body.facebook,
      req.body.instagram,
      req.body.twitter,
      req.body.linkedin,
      userInfo.id,
    ];

    // first update the profile
    db.query(q, values, (err, data) => {
      if (err) res.status(500).json(err);

      // if the profile was updated
      if (data.affectedRows > 0) {
        // take the new userdata and return it except for password
        db.query(
          "SELECT * FROM users WHERE id=?",
          [userInfo.id],
          (err, data) => {
            if (err) res.status(500).json(err);

            const { password, ...others } = data[0];
            return res.status(200).json(others);
          }
        );
      } else return res.status(403).json("You can update only your post!");
    });
  });
};

export const findUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // DONE VERFYING THE USER, NOW LETS DO THE ACTUAL JOB

    const q = "SELECT * FROM users WHERE username=?";

    const username = req.query.search;

    db.query(q, [username], (err, data) => {
      if (err) return res.status(500).json(err);

      if (data.length === 0) return res.status(404).json("User not found");
      const { password, ...others } = data[0];

      return res.status(200).json(others);
    });
  });
};

export const getFollowing = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT r.followedUserId, u.name, u.id, u.profilePic FROM relationships r INNER JOIN users u ON (u.id=r.followedUserId) WHERE r.followerUserId=?";

    const userId = req.params.userId;

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};
export const getFollowers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT r.followedUserId, u.name, u.id, u.profilePic FROM relationships r INNER JOIN users u ON (u.id=r.followerUserId) WHERE r.followedUserId=?";

    const userId = req.params.userId;

    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);
    });
  });
};
export const getNewUsers = (req, res) => {
  // console.log("yeah yeah working");
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    // return res.status(200).json("hey");

    const q =
      "SELECT * FROM users WHERE id NOT IN ( SELECT u.id FROM relationships r INNER JOIN users u ON (u.id=r.followedUserId) WHERE r.followerUserId=?) AND id <> ?";

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);

      // console.log(data);

      return res.status(200).json(data);
    });
  });
};
