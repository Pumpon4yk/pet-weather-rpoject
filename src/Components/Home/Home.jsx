import { useEffect, useState } from 'react';
import { Container } from './Home.styled';
import CardWeater from '../CardWeater/CardWeater';
import SearchWeather from '../SearchWeather/SearchWeather';
import { Toaster } from 'react-hot-toast';

import {getCurrentWesatherCoord} from '../../../API/API-weather';
import getCity from '../../../API/API-checkIP';


const Home = () => {
  const [citySearch, setCitySearch] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(false);

  useEffect(() => {
    if (!location) {
      getCity()
      .then(({coord, city}) => {
        setLocation(coord)
        setCitySearch(city)
      })
    }
      
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lon } = position.coords;
  
          setLocation({ lat, lon });
          
        },
        (error) => {

          setLocError(true)
        }
      ) 
    }, 1000)

  }, [])

  useEffect(() => {
    if(!location) return;


    getCurrentWesatherCoord(location)
    .then(res => res.data)
    .then(data => setCurrentWeather(data))
    .catch(err => console.log(err))
  }, [location]);

  return (
    <Container>
      <SearchWeather location={location} setLocation={setLocation} setCitySearch={setCitySearch} />
      {currentWeather &&
        <CardWeater weather={currentWeather} citySearch={citySearch}/>}
        <Toaster position="top-right"/>
    </Container>
  );
};

export default Home;
