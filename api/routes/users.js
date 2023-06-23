import express from "express";
import {
  getUser,
  updateUser,
  findUser,
  getFollowing,
  getFollowers,
  getNewUsers,
} from "../controllers/users.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/find/:userId/following", getFollowing);
router.get("/find/:userId/followers", getFollowers);
router.get("/find/:userId/discoverPeople", getNewUsers);

router.put("/", updateUser);
router.get("/find", findUser);

export default router;
