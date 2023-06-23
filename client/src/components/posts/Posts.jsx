import { makeRequest } from "../../axios.js";
import { Post } from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

export const Posts = ({ userId }) => {
  // console.log("Displaying post of userId" + userId);

  const { isLoading, error, data } = useQuery(
    ["posts", userId],
    ({ queryKey }) => {
      const [_, userId] = queryKey;
      console.log("running");
      return makeRequest.get("/posts?userId=" + userId).then((res) => {
        console.log(userId);
        console.log(res.data);
        return res.data;
      });
    }
  );

  // console.log(data);

  return (
    <div className="posts">
      {error
        ? "Something went wrong..."
        : isLoading
        ? "Loading..."
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};
