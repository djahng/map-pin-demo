import React, { useEffect, useState } from 'react';

import ClusteredMarkersWithInfoMap from './ClusteredMarkersWithInfoMap';

import firebase from '../api/firebase';

const Map = () => {
  const [markers, setMarkers] = useState([]);

  // Load pins from database
  useEffect(() => {
    const db = firebase.firestore();
    const pins = [];

    let collectionName = '';

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      collectionName = 'pins-dev';
    } else {
      collectionName = 'pins-prod';
    }

    db.collection(collectionName).get()
      .then(snapshot => {
        snapshot.forEach(pin => {
          pins.push(pin.data());
        });

        setMarkers(pins);
      })
      .catch(error => console.log('Error getting documents', error));
  }, []);

  return (
    <div className="container">
      <ClusteredMarkersWithInfoMap
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100vh' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        markers={markers}
      />
    </div>
  );
};

export default Map;
