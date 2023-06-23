import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

export const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments" + postId], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      // console.log(res.data);
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments" + postId]);
      },
    }
  );

  const handleShareClick = async (e) => {
    e.preventDefault();

    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/uploads/" + currentUser.profilePic} alt="" />
        <textarea
          type="text"
          placeholder="Write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <div className="sendIcon">
          <SendRoundedIcon onClick={handleShareClick} />
        </div>
      </div>
      {error
        ? "Error loading comments"
        : isLoading
        ? "Loading comments..."
        : data.map((comment) => {
            return (
              <div className="comment" key={comment.id}>
                <div className="profilePic">
                  <Link to={`/profile/${comment.userId}`}>
                    <img src={"/uploads/" + comment.profilePic} alt="" />
                  </Link>
                </div>
                <div className="commentInfo">
                  <div className="desc">
                    <Link to={`/profile/${comment.userId}`} className="name">
                      <span>{comment.name}</span>
                    </Link>
                    <p>{comment.desc}</p>
                  </div>
                  <div className="datetime">
                    {moment(comment.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};
