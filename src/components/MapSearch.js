import React from 'react';
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

const MapSearch = (props) => {
  const markerLocation = {
    lat: props.markerLocation.lat,
    lng: props.markerLocation.lng
  };

  const getMarkerPosition = (event) => {
    const { latLng } = event;

    const newPosition = {
      lat: latLng.lat(),
      lng: latLng.lng()
    };

    props.onMarkerChange(newPosition);
  };

  return (
    <GoogleMap
      defaultCenter={markerLocation}
      defaultZoom={8}
    >
      <Marker
        position={markerLocation}
        draggable
        onDragEnd={getMarkerPosition}
      />
    </GoogleMap>
  );
};

export default withGoogleMap(MapSearch);
