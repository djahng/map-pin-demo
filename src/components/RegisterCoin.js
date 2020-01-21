import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';

import MapSearch from './MapSearch';

import geolocate from '../api/geolocate';
import firebase from '../api/firebase';

const RegisterCoin = (props) => {
  const { register, handleSubmit, getValues, errors } = useForm();

  const [imageURL, setImageURL] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [location, setLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  let widget = null;

  const onMarkerChange = (newPosition) => {
    setLocation(newPosition);
  };

  const findLocation = async (term) => {
    const loc = await geolocate(term);

    return loc;
  };

  const addFuzziness = (loc) => {
    const min = -0.00011;
    const max = 0.00011;

    const lat = loc.lat + (Math.random() * (max-min) + min);
    const lng = loc.lng + (Math.random() * (max-min) + min);

    return { lat, lng };
  };

  const findLocationAndShowMap = async () => {
    const values = getValues();
    const { searchTerm } = values;

    try {
      const loc = await findLocation(searchTerm);

      // Add fuzziness to location to avoid overlapping pins
      const lessPreciseLocation = addFuzziness(loc);

      setLocation(lessPreciseLocation);
      setShowMap(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    if (submitClicked) {
      const { coinID, title, description } = data;

      if (!location) {
        const { searchTerm } = data;
        const loc = await findLocation(searchTerm);
        setLocation(loc);
      }

      let collectionName = '';

      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        collectionName = 'pins-dev';
      } else {
        collectionName = 'pins-prod';
      }

      const db = firebase.firestore();
      const pinRef = db.collection(collectionName).doc(coinID);

      pinRef.set({
        coinID,
        title,
        description,
        location,
        imageURL
      })
      .then(() => props.history.push('/thank-you'))
      .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    widget = window.cloudinary.createUploadWidget({
      cloudName: process.env.REACT_APP_COUNDINARY_CLOUD_NAME,
      uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET_NAME,
      sources: ['local', 'camera'],
      multiple: false,
      resourceType: 'image',
      tags: ['pin-image'],
      maxImageWidth: 350
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        console.log(result.info);
        console.log(result.info.secure_url);

        const { secure_url, original_filename, format } = result.info;

        setUploadedImageName(`${original_filename}.${format}`);
        setImageURL(secure_url);
      } else if (!error && result && result.event === 'close') {
        widget.close();
      } else if (error) {
        console.log(error);
      }
    });
  });

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label" htmlFor="coinID">Coin ID</label>
          <div className="control">
            <input
              id="coinID"
              name="coinID"
              className="input"
              type="text"
              ref={register({
                required: true,
                minLength: 6,
                maxLength: 6,
                pattern: /^[0-9]*$/
              })}
            />
            {errors.coinID && errors.coinID.type === 'required' && <span className="help is-danger">Required</span>}
            {errors.coinID && errors.coinID.type === 'minLength' && <span className="help is-danger">Please enter a valid ID</span>}
            {errors.coinID && errors.coinID.type === 'maxLength' && <span className="help is-danger">Please enter a valid ID</span>}
            {errors.coinID && errors.coinID.type === 'pattern' && <span className="help is-danger">Please enter a valid ID</span>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="title">Title</label>
          <div className="control">
            <input
              id="title"
              name="title"
              className="input"
              type="text"
              ref={register({
                required: true,
                maxLength: 500
              })}
            />
            {errors.title && errors.title.type === 'required' && <span className="help is-danger">Required</span>}
            {errors.title && errors.title.type === 'maxLength' && <span className="help is-danger">500 characters or less</span>}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="description">Description</label>
          <div className="control">
            <textarea
              id="description"
              name="description"
              className="textarea"
              type="text"
              ref={register({
                required: true,
                maxLength: 5000
              })}
            />
            {errors.description && errors.description.type === 'required' && <span className="help is-danger">Required</span>}
            {errors.description && errors.description.type === 'maxLength' && <span className="help is-danger">5000 characters or less</span>}
          </div>
        </div>

        <label className="label" htmlFor="searchTerm">Enter a Location</label>
        <p className="help">Note: this location will be publicly available.</p>
        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              id="searchTerm"
              name="searchTerm"
              className="input"
              type="text"
              placeholder="e.g. address or city, state"
              onBlur={() => setShowMap(true)}
              ref={register({
                required: true,
                maxLength: 1000
              })}
            />
            {errors.searchTerm && errors.searchTerm.type === 'required' && <span className="help is-danger">Required</span>}
            {errors.searchTerm && errors.searchTerm.type === 'maxLength' && <span className="help is-danger">1000 characters or less</span>}
          </div>

          <div className="control">
            <button className="button is-warning" onClick={findLocationAndShowMap}>Find Location</button>
          </div>
        </div>

        {showMap && location &&
          <div style={{ marginBottom: '20px' }}>
            <MapSearch
              loadingElement={<div style={{ height: '100%' }} />}
              containerElement={<div style={{ height: '300px' }} />}
              mapElement={<div style={{ height: '100%' }} />}
              onMarkerChange={onMarkerChange}
              markerLocation={location}
            />
          </div>
        }

        <div className="field">
          <button className="button is-warning" onClick={() => widget.open()}>
            Upload an Image (Optional)
          </button>
          {uploadedImageName !== '' && <span className="help">{uploadedImageName} selected</span>}
        </div>

        <div className="control">
          <button
            className="button is-link"
            type="submit"
            disabled={!location}
            onClick={() => setSubmitClicked(true)}
          >
            Submit
          </button>
          {!location && <span className="help is-danger">Please verify location first</span>}
        </div>
      </form>
    </div>
  );
};

export default RegisterCoin;
