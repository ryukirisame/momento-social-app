import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Comments } from "../comments/Comments";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { UpdatePost } from "../updatePost/UpdatePost";

export const Post = ({ post }) => {
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [commentsVisible, setCommentsVisible] = useState(false);

  const { isLoading, error, data } = useQuery(["likes" + post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      // console.log(res.data);
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      else return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes" + post.id]);
      },
    }
  );

  const handleLike = (e) => {
    e.preventDefault();

    mutation.mutate(data.includes(currentUser.id));
  };

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + post.id);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleDelete = (e) => {
    e.preventDefault();

    deleteMutation.mutate(post.id);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setUpdateModal(true);
  };

  return (
    <div className="post">
      <div className="user">
        <div className="userInfo">
          <Link
            to={`/profile/${post.userId}`}
            style={{
              textDecoration: "none",
              margin: "0px",
            }}
          >
            <img src={"/uploads/" + post.profilePic} alt="" />
          </Link>
          <div className="details">
            <Link
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="name">{post.name}</span>
            </Link>
            <span className="datetime">{moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
        <div className="moreMenu" onClick={() => setMenuOpen(!menuOpen)}>
          <MoreHorizIcon className="icon" />
          {menuOpen && post.userId === currentUser.id && (
            <div className="menu">
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <p className="description">{post.desc}</p>
        {post.img && (
          <img src={"/uploads/" + post.img} alt="" className="image" />
        )}
      </div>
      <div className="info">
        <div className="item" onClick={handleLike}>
          {error ? (
            "Error loading likes"
          ) : isLoading ? (
            "Loading likes"
          ) : data?.includes(currentUser.id) ? (
            <FavoriteOutlinedIcon style={{ color: "#ee5253" }} />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
          {data?.length} Likes
        </div>
        <div
          className="item"
          onClick={() => {
            setCommentsVisible(!commentsVisible);
          }}
        >
          <TextsmsOutlinedIcon />
          Comments
        </div>
      </div>
      {commentsVisible && <Comments postId={post.id} />}
      {updateModal && (
        <UpdatePost setUpdateModal={setUpdateModal} post={post} />
      )}
    </div>
  );
};
