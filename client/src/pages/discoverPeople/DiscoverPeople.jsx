import React, { useContext } from "react";
import "./discoverPeople.scss";
// import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { ProfileCard } from "../../components/profileCard/ProfileCard";
import { AuthContext } from "../../context/authContext";

export const DiscoverPeople = () => {
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["discover"], () => {
    return makeRequest
      .get("/users/find/" + currentUser.id + "/discoverPeople")
      .then((res) => {
        console.log(res.data);

        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
  });
  return (
    <div className="discoverPeople">
      <div className="container">
        <span>Discover People</span>
        <div className="people">
          {error ? (
            "Error loading..."
          ) : isLoading ? (
            "Loading..."
          ) : data.length === 0 ? (
            <span>No one here</span>
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
