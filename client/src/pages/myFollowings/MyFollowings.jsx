import React, { useContext, useState } from "react";
import "./myFollowings.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { ProfileCard } from "../../components/profileCard/ProfileCard";

export const MyFollowings = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["following"], () => {
    return makeRequest
      .get("/users/find/" + currentUser.id + "/following")
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
  });

  return (
    <div className="myFollowings">
      <div className="container">
        <span>People you follow</span>
        <div className="followings">
          {error ? (
            "Error loading..."
          ) : isLoading ? (
            "Loading..."
          ) : data.length === 0 ? (
            <span>You don't follow anyone</span>
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
