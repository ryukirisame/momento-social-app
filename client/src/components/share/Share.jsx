import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = ({ post, setUpdateModal }) => {
  const { currentUser } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState(post != undefined ? post.desc : "");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      if (post) return makeRequest.put("/posts", newPost);

      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleShareClick = async (e) => {
    e.preventDefault();
    let imgUrl = post?.img ? post.img : "";
    if (file) imgUrl = await upload();

    if (post)
      mutation.mutate({ desc, img: imgUrl, userId: post.userId, id: post.id });
    else mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
    if (setUpdateModal) setUpdateModal(false);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/uploads/" + currentUser.profilePic} alt="" />
            <textarea
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="fileImg" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <label>
              <input
                type="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="item">
                <img src={Image} alt="" />
                <span>{post ? "Update Image" : "Add Image"}</span>
              </div>
            </label>
          </div>
          <div className="right">
            <button onClick={handleShareClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
