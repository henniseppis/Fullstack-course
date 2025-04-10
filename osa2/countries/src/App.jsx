import { useState, useEffect } from 'react'
import countryService from "./services/countries"

const Button = (props) => (
  <button type="button" onClick={props.onClick}>
    {props.text}
  </button>
);

const Filter = (props) => {
  return (
  <div>
    <h2>Find countries</h2>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input value={props.text} onChange={props.onChange} />
      <Button text="Empty the textbox" onClick={props.onClick} />
    </div>
  </div>
  )
}


const App = () => {
  const [Show, setShow] = useState('')
  const [Countries, setCountries] = useState([])

  useEffect(() => {
    countryService
    .getAll()
    .then((countryData) => {
      setCountries(countryData);
    });
  }, []);

  const handleShowChange = (event) => {
    setShow(event.target.value)
  };

  const handleButtonClick = (country) => {
    setShow(country.name.common);
  };

  const handleButtonClickEmpty = () => {
    setShow("");
  };


  const filteredCountries = 
  Countries.filter((country) =>
    country.name.common.toLowerCase().includes(Show.toLowerCase())
  );

  let whatToShow;
  if (Show === "") {
    whatToShow = <p> Start by typing something</p>
  }
  else if (filteredCountries.length === 1) {
    const country = filteredCountries[0]; 
    whatToShow = (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Languages</h2>
        <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
        </ul>
        <p style={{ fontSize: "200px",  marginTop: "10px"}}>{country.flag}</p>
      </div>
    )
  } else if (filteredCountries.length > 10) {
    whatToShow = <p> Too many matches, specify another filter</p>
  }
  else {
    whatToShow = (
      <ul>
        {filteredCountries.map((country) => (
          <li key={country.name.common}>
            {country.name.common} 
            <Button text={"Show"} onClick={() => handleButtonClick(country)}/>
          </li>
        ))}
      </ul>
    )
  }
  
  return (
    <>
    <Filter text = {Show} onChange={handleShowChange} onClick={() => handleButtonClickEmpty()}/>
    {whatToShow}
     </>
  )

}

export default App
