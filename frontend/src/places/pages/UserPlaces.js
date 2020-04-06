import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlacesList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http.hook";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const uid = useParams().uid;

  useEffect(() => {
    (async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${uid}`);
        setLoadedPlaces(responseData.places);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [sendRequest, uid]);

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(p => p.id !== deletedPlaceId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
