import { Posts } from "../../components/posts/Posts";
import Share from "../../components/share/Share";

import "./home.scss";

export const Home = () => {
  return (
    <div className="home">
      <Share />
      <Posts />
    </div>
  );
};
