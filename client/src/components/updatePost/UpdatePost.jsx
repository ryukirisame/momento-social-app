import React from "react";
import "./updatePost.scss";
import Share from "../share/Share";
import CloseIcon from "@mui/icons-material/Close";

export const UpdatePost = ({ post, setUpdateModal }) => {
  return (
    <div className="updatePost">
      <CloseIcon
        className="closeButton"
        fontSize="large"
        onClick={() => {
          setUpdateModal(false);
        }}
      />
      <div className="updateTools">
        <Share post={post} setUpdateModal={setUpdateModal} />
      </div>
    </div>
  );
};
