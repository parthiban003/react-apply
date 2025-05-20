import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [showTable, setShowTable] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const countries = data.map(country => country.name.common);
        setAllCountries(countries.sort());
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'country') {
      const matched = allCountries.filter(c => c.toUpperCase().startsWith(value.toUpperCase()));
      setFilteredCountries(matched);
    }

    if (name === 'city') {
      const matched = indianCities.filter(c => c.toUpperCase().startsWith(value.toUpperCase()));
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

    const isValid = Object.values(form).every(val => val !== '');
    if (!isValid) {
      alert('Please fill out all fields.');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('user1')) || [];
    const updated = [...existing, form];
    localStorage.setItem('user1', JSON.stringify(updated));
    alert('Registered Successfully!');
    setForm({
      name: '',
      age: '',
      dob: '',
      email: '',
      password: '',
      country: '',
      city: '',
      pincode: '',
    });
  };

  const handleShowDetails = () => {
    const data = JSON.parse(localStorage.getItem('user1')) || [];
    setUsers(data);
    setShowTable(true);
  };

  return (
    
    <form onSubmit={handleSubmit} className='app mt-5' autoComplete='off'>
      <h1 className='text-success'style={{marginLeft:'110%'}}>Welcome!</h1>
      <div className='container mb-4' style={{ fontFamily: 'Montserrat' }}>
        <h2 className='fw-bold text-primary'style={{marginBottom:'40px'}}>REGISTRATION FORM</h2>
        <div className='row mt-4 bg-light p-4 rounded'>
          <div className='col-lg-6 col-sm-12'>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} value={form.name} className='form-control mt-3' />
            <input type="text" name="age" placeholder="Age" onChange={handleChange} value={form.age} className='form-control mt-3' />
            <input type="date" name="dob" onChange={handleChange} value={form.dob} className='form-control mt-3' />
            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} value={form.email} className='form-control mt-3' />
          </div>
          <div className='col-lg-6 col-sm-12'>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} className='form-control mt-3' />
            <input
              type="text"
              name="country"
              placeholder="Country"
              onChange={handleChange}
              value={form.country}
              onFocus={() => setFilteredCountries(allCountries)}
              className='form-control mt-3'
            />
            {filteredCountries.length > 0 && (
              <div className="suggestions-list border bg-white position-relative z-3">
                {filteredCountries.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('country', c)} className="suggestion-item p-1 cursor-pointer">
                    {c}
                  </div>
                ))}
              </div>
            )}

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              value={form.city}
              onFocus={() => setFilteredCities(indianCities)}
              className=' form-control mt-3 position-relative'
            />
            {filteredCities.length > 0 && (
              <div className="suggestions-list border bg-white position-relative">
                {filteredCities.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('city', c)} className="suggestion-item p-1 cursor-pointer">
                    {c}
                  </div>
                ))}
              </div>
            )}
            <input type="number" name="pincode" placeholder="Pin-Code" onChange={handleChange} value={form.pincode} className='form-control mt-3' />
          </div>
        </div>

        <div className='text-center mt-4'>
          <button type="submit" className="btn btn-primary fw-bold me-3">Submit</button>
          <button type="button" className="btn btn-outline-secondary fw-bold" onClick={handleShowDetails}>Show Details</button>
        </div>

        {showTable && users.length > 0 && (
          <div className='mt-5'>
            <h4 className='text-dark text-center mb-4'>User Details</h4>
            <table className='table table-striped table-bordered bg-white'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>DOB</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i}>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.dob}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.country}</td>
                    <td>{user.city}</td>
                    <td>{user.pincode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </form>
  );
}

export default App;
