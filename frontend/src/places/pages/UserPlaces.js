import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const history = useHistory();
  const [userPlaces, setUserPlaces] = useState();

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setUserPlaces(responseData.places);
        console.log(responseData.places);
      } catch (err) {}
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const deletePlace = (placeId) => {
    setUserPlaces((places) => places.filter((p) => p.id !== placeId));
  };

  const modalHttpError = () => {
    clearError();
    history.push("/");
  };

  return (
    <React.Fragment>
      {!userPlaces && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <ErrorModal error={error} onClear={modalHttpError} />
      {!isLoading && userPlaces && (
        <PlaceList items={userPlaces} onDelete={deletePlace} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
