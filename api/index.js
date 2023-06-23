import express from "express";
// import mysql from "mysql";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import authRoutes from "./routes/auth.js";
import relationshipRoutes from "./routes/relationship.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const app = express();

// MIDDLE WARES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Sid@1997",
//   database: "social",
// });

// app.get("/", (req, res) => {
//   res.json("hello this is the backend");
// });

// app.get("/users", (req, res) => {
//   const q = "SELECT * FROM users";
//   db.query(q, (err, data) => {
//     if (err) return res.json(err);

//     return res.json(data);
//   });
// });

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationship", relationshipRoutes);

app.listen(8800, () => {
  console.log("Connnection established");
});
