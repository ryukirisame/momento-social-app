import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Posts } from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useLocation } from "react-router-dom";
import { UpdateProfile } from "../../components/updateProfile/UpdateProfile";

export const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const { setCurrentUser } = useContext(AuthContext);

  const location = useLocation();

  let userId = parseInt(location.pathname.split("/")[2]);

  // WHENEVER WE WILL MOVE TO ANOTHER PROFILE PAGE THEN UPDATE THE PAGE
  // SO WE ARE WAITING FOR URL TO CHANGE
  useEffect(() => {
    let prevUserId = userId;
    userId = parseInt(location.pathname.split("/")[2]);
    queryClient.invalidateQueries(["user", prevUserId]);
  }, [location]);

  const { isLoading, error, data } = useQuery(
    ["user", userId],
    ({ queryKey }) => {
      const [_, userId] = queryKey;

      return makeRequest.get("/users/find/" + userId).then((res) => {
        // console.log(res.data);
        return res.data;
      });
    }
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationship?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const mutation = useMutation(
    (following) => {
      // if we are already following the person then unfollow
      if (following)
        return makeRequest.delete("/relationship?userId=" + userId);

      // if we are not following the person then follow
      return makeRequest.post("/relationship", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Loading profile"
      ) : (
        <>
          <div className="images">
            <img
              src={"/uploads/" + data.coverPic}
              alt=""
              className="coverPic"
            />

            <img
              src={"/uploads/" + data.profilePic}
              alt=""
              className="profilePic"
            />
          </div>

          <div className="profileContainer">
            <div className="userInfo">
              <div className="center">
                <span className="name">{data?.name}</span>
                <div className="info">
                  <div className="left">
                    {data.facebook ? (
                      <a href={data.facebook} target="_blank">
                        <FacebookTwoToneIcon />
                      </a>
                    ) : (
                      ""
                    )}

                    {data.instagram ? (
                      <a href={data.instagram} target="_blank">
                        <InstagramIcon />
                      </a>
                    ) : (
                      ""
                    )}
                    {data.twitter ? (
                      <a href={data.twitter} target="_blank">
                        <TwitterIcon />
                      </a>
                    ) : (
                      ""
                    )}
                    {data.linkedin ? (
                      <a href={data.linkedin} target="_blank">
                        <LinkedInIcon />
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="right">
                    {data.city && (
                      <div className="item">
                        <PlaceIcon className="icon" />
                        <span>{data.city}</span>
                      </div>
                    )}
                    {data.website && (
                      <div className="item">
                        <LanguageIcon className="icon" />

                        <span>{data.website}</span>
                      </div>
                    )}
                  </div>
                </div>
                {userId === currentUser.id ? (
                  <button
                    onClick={() => {
                      setOpenUpdate(true);
                    }}
                  >
                    Update
                  </button>
                ) : (
                  <button onClick={handleFollow}>
                    {rIsLoading
                      ? "Loading"
                      : relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <Posts userId={userId} />
        </>
      )}
      {openUpdate && (
        <UpdateProfile
          setOpenUpdate={setOpenUpdate}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
};
