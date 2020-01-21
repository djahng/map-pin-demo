import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, withGoogleMap } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
import Linkify from 'react-linkify';

const ClusteredMarkersWithInfoMap = (props) => {
  const { markers } = props;

  const defaultCenter = { lat: 39.5, lng: -97.6 };
  const defaultZoom = 3

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarkerID, setActiveMarkerID] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState({});

  const onMarkerClick = (pin) => {
    setActiveMarkerID(pin.coinID);
    setSelectedPlace(pin);

    if (showingInfoWindow) {
      setShowingInfoWindow(false);
    }

    setShowingInfoWindow(true);
  };

  const onMapClick = () => {
    if (showingInfoWindow) {
      setShowingInfoWindow(false);
      setActiveMarkerID(null);
      setSelectedPlace({});
    }
  };

  return (
    <GoogleMap
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      options={{ fullscreenControl: true }}
      onClick={onMapClick}
    >
      <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {markers.map((pin) => (
          <Marker
            key={pin.coinID}
            position={{ lat: pin.location.lat, lng: pin.location.lng }}
            id={pin.coinID}
            name={pin.title}
            title={pin.title}
            image={pin.imageURL}
            description={pin.description}
            onClick={() => onMarkerClick(pin)}
          >

            {showingInfoWindow && selectedPlace && activeMarkerID === pin.coinID && (
              <InfoWindow
                anchor={selectedPlace}
                onCloseClick={() => setShowingInfoWindow(false)}
                options={{ maxWidth: 350 }}
              >
                <div>
                  <div style={{ fontSize: '0' }}>Coin ID: {selectedPlace.coinID}</div>
                  <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedPlace.title}</h2>

                  {selectedPlace.imageURL && <div className="image" style={{ marginTop: '12px' }}><img src={selectedPlace.imageURL} alt="" /></div>}

                  <hr />

                  <p style={{ fontSize: '1rem' }}>
                    <Linkify>
                      {selectedPlace.description}
                    </Linkify>
                  </p>
                </div>
              </InfoWindow>
            )}

          </Marker>
        ))}
      </MarkerClusterer>
    </GoogleMap>
  );
};

export default withGoogleMap(ClusteredMarkersWithInfoMap);
