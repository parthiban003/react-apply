import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

const indianCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Coimbatore'];

function App() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    dob: '',
    email: '',
    password: '',
    country: '',
    city: '',
    pincode: '',
  });

  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => country.name.common);
        setAllCountries(countries.sort()); 
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      const matched = allCountries.filter(c =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(matched);
    }

    if (name === 'city') {
      const matched = indianCities.filter(c =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(matched);
    }
  };

  const handleSelect = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'country') setFilteredCountries([]);
    if (name === 'city') setFilteredCities([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fields = ['name', 'age', 'dob', 'email', 'password', 'country', 'city', 'pincode'];
    const missing = fields.find(field => !$('#' + field).val());

    if (missing) {
      alert(`Enter a ${missing}`);
    } else {
      alert('Registered Successfully!');
      console.log(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }} className='app mt-5'>
      <h2 className='fw-bold text-danger'>REGISTRATION FORM</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} id='name' /><br />
      <input type="text" name="age" placeholder="Age" onChange={handleChange} id='age' /><br />
      <input type="date" name="dob" placeholder="DOB" onChange={handleChange} id='dob' /><br />
      <input type="email" name="email" placeholder="E-mail" onChange={handleChange} id='email' /><br />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} id='password' /><br />

      <input
        type="text"
        name="country"
        placeholder="Country"
        onChange={handleChange}
        value={form.country}
        onFocus={() => setFilteredCountries(allCountries)}
        id='country'
      />
      {filteredCountries.length > 0 && (
        <div className="suggestions border bg-light">
          {filteredCountries.map((country, i) => (
            <div key={i} onClick={() => handleSelect('country', country)} className="p-1">
              {country}
            </div>
          ))}
        </div>
      )}
      <br />

      <input
        type="text"
        name="city"
        placeholder="City"
        onChange={handleChange}
        value={form.city}
        onFocus={() => setFilteredCities(indianCities)}
        id='city'
      />
      {filteredCities.length > 0 && (
        <div className="suggestions border bg-light">
          {filteredCities.map((city, i) => (
            <div key={i} onClick={() => handleSelect('city', city)} className="p-1">
              {city}
            </div>
          ))}
        </div>
      )}
      <br />

      <input type="number" name="pincode" placeholder="Pin-Code" onChange={handleChange} id='pincode' /><br />
      <button type="submit" className="btn btn-danger">Submit</button><br />
    </form>
  );
}

export default App;
