import React, { useState } from "react";
import "./updateProfile.scss";
import CloseIcon from "@mui/icons-material/Close";
import { makeRequest } from "../../axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const UpdateProfile = ({
  setOpenUpdate,
  currentUser,
  setCurrentUser,
}) => {
  // console.log(currentUser);
  const [name, setName] = useState(currentUser.name);
  const [city, setCity] = useState(currentUser.city);
  const [website, setWebsite] = useState(currentUser.website);
  const [facebook, setFacebook] = useState(currentUser.facebook);
  const [instagram, setInstagram] = useState(currentUser.instagram);
  const [twitter, setTwitter] = useState(currentUser.twitter);
  const [linkedin, setLinkedin] = useState(currentUser.linkedin);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const upload = async (file) => {
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
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: (newUserData) => {
        setCurrentUser(newUserData.data);
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleUpdate = async (e) => {
    e.preventDefault();

    let coverUrl, profileUrl;
    coverUrl = coverPic ? await upload(coverPic) : currentUser.coverPic;
    profileUrl = profilePic ? await upload(profilePic) : currentUser.profilePic;

    mutation.mutate({
      name,
      coverPic: coverUrl,
      profilePic: profileUrl,
      city,
      website,
      facebook,
      instagram,
      twitter,
      linkedin,
    });
    setOpenUpdate(false);
  };

  return (
    <div className="updateProfile">
      <CloseIcon
        className="closeButton"
        fontSize="large"
        onClick={() => {
          setOpenUpdate(false);
        }}
      />
      <div className="container">
        <form>
          <label>
            Choose Profile Pic
            <input
              type="file"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </label>
          {profilePic && (
            <img
              className="fileImg"
              alt=""
              src={URL.createObjectURL(profilePic)}
            />
          )}

          <label>
            Choose Cover Pic
            <input
              type="file"
              onChange={(e) => setCoverPic(e.target.files[0])}
            />
          </label>
          {coverPic && (
            <img
              className="fileImg"
              alt=""
              src={URL.createObjectURL(coverPic)}
            />
          )}
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="text"
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
          <input
            type="text"
            placeholder="Website"
            onChange={(e) => setWebsite(e.target.value)}
            value={website}
          />
          <input
            type="text"
            placeholder="Facebook"
            onChange={(e) => setFacebook(e.target.value)}
            value={facebook}
          />
          <input
            type="text"
            placeholder="Instagram"
            onChange={(e) => setInstagram(e.target.value)}
            value={instagram}
          />
          <input
            type="text"
            placeholder="Twitter"
            onChange={(e) => setTwitter(e.target.value)}
            value={twitter}
          />
          <input
            type="text"
            placeholder="LinkedIn"
            onChange={(e) => setLinkedin(e.target.value)}
            value={linkedin}
          />
          <button onClick={handleUpdate}>Update</button>
        </form>
      </div>
    </div>
  );
};
