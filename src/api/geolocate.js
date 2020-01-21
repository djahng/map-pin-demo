import axios from 'axios';

const geolocate = async (term) => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json';

  const params = {
    key: apiKey,
    address: term
  };

  try {
    const response = await axios.get(baseURL, { params });

    const location = response.data.results[0].geometry.location;

    // console.log(response.data.results[0].formatted_address);

    return location;
  } catch (error) {
    // console.log(error);

    return null;
  }
};

export default geolocate;
