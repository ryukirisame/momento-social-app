import React, { useState } from "react";
import "./findFriends.scss";
import { useLocation } from "react-router-dom";
import { ProfileCard } from "../../components/profileCard/ProfileCard";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

export const FindFriends = () => {
  const location = useLocation();

  const [responseStatus, setResponseStatus] = useState("");

  let searchString = location.pathname.split("/")[2];

  const { isLoading, error, data } = useQuery(
    ["findfriend", searchString],
    ({ queryKey }) => {
      const [_, searchString] = queryKey;

      return makeRequest
        .get("/users/find?search=" + searchString)
        .then((res) => {
          //   console.log("we are here in then");
          //   console.log(res.data);
          setResponseStatus(res.status);
          return res.data;
        })
        .catch((err) => {
          setResponseStatus(err.response.data);
          return err.response.data;
        });
    }
  );

  return (
    <div className="findFriends">
      {error ? (
        "Error finding user..."
      ) : isLoading ? (
        "Loading..."
      ) : (
        <div className="searchResult">
          <span>Search result</span>

          {responseStatus == 200 ? (
            <div className="result">
              <ProfileCard profile={data} />
            </div>
          ) : (
            <span>{responseStatus}</span>
          )}
        </div>
      )}
    </div>
  );
};
