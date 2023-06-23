import React, { useContext } from "react";
import "./myFollowers.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { ProfileCard } from "../../components/profileCard/ProfileCard";

export const MyFollowers = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["followers"], () => {
    return makeRequest
      .get("/users/find/" + currentUser.id + "/followers")
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
  });

  return (
    <div className="myFollowers">
      <div className="container">
        <span>People who follow you</span>
        <div className="followers">
          {error ? (
            "Error loading..."
          ) : isLoading ? (
            "Loading..."
          ) : data.length === 0 ? (
            <span>You don't have any followers</span>
          ) : (
            data.map((profile) => {
              return <ProfileCard profile={profile} key={profile.id} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};
