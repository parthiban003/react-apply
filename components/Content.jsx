import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const citiesByCountry = {
  India: {
    'Madurai': '625001',
    'Mumbai': '400001',
    'Bangalore': '560001',
    'Chennai': '600001',
    'Kolkata': '700001',
    'Hyderabad': '500001',
    'Pune': '411001',
    'Ahmedabad': '380001',
    'Coimbatore': '641001',
    'Jaipur': '302001',
  },
  America: {
    'New York': '10001',
    'Los Angeles': '90001',
    'Chicago': '60601',
    'Houston': '77001',
    'Phoenix': '85001',
    'Philadelphia': '19019',
    'San Antonio': '78201',
    'San Diego': '92101',
    'Dallas': '75201',
    'San Jose': '95101',
  },
  England: {
    'London': 'EC1A 1BB',
    'Birmingham': 'B1 1AA',
    'Manchester': 'M1 1AE',
    'Leeds': 'LS1 1UR',
    'Liverpool': 'L1 1JR',
    'Sheffield': 'S1 1WB',
    'Bristol': 'BS1 4ST',
    'Newcastle': 'NE1 4LP',
    'Nottingham': 'NG1 1AA',
    'Leicester': 'LE1 1AA',
  },
  Afghanistan: {
    'Kabul': '1001',
    'Kandahar': '3801',
    'Herat': '2001',
    'Mazar-i-Sharif': '1701',
    'Jalalabad': '2601',
    'Kunduz': '2501',
    'Ghazni': '2301',
    'Bamyan': '2401',
    'Baghlan': '2201',
    'Farah': '2101',
  },
  Zimbabwe: {
    'Harare': '00263',
    'Bulawayo': '00264',
    'Chitungwiza': '00265',
    'Mutare': '00266',
    'Gweru': '00267',
    'Kwekwe': '00268',
    'Masvingo': '00269',
    'Chinhoyi': '00270',
    'Marondera': '00271',
    'Norton': '00272',
  },
};

const statesByCountry = {
  India: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Gujarat', 'Rajasthan'],
  America: ['New York', 'California', 'Illinois', 'Texas', 'Arizona', 'Pennsylvania'],
  England: ['Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire'],
  Afghanistan: ['Kabul', 'Herat', 'Kandahar', 'Balkh'],
  Zimbabwe: ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland'],
};

const API_URL = 'https://682c6773d29df7a95be6e6ee.mockapi.io/user';

function RegistrationForm({ showDetails }) {
  const initialForm = {
    name: '', age: '', dob: '', email: '', gender: '',
    address: '', country: '', state: '', city: '', pincode: ''
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const countries = data.map(c => c.name.common).sort();
        countries.push('America', 'England');
        setAllCountries(countries);
      });
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === 'age' && !/^\d*$/.test(value)) return;

  setForm(prev => ({ ...prev, [name]: value }));
  setErrors(prev => ({ ...prev, [name]: '' }));
  setSubmitted(false); 

  if (name === 'country') {
    const matchedCountries = allCountries.filter(c =>
      c.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCountries(matchedCountries);
    setFilteredStates([]);
    setFilteredCities([]);
    setForm(prev => ({
      ...prev,
      state: '',
      city: '',
      pincode: '',
    }));
  }

  if (name === 'state') {
    const stateList = statesByCountry[form.country] || [];
    const matchedStates = stateList.filter(s =>
      s.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredStates(matchedStates);
  }

  if (name === 'city') {
    const cityList = citiesByCountry[form.country]
      ? Object.keys(citiesByCountry[form.country])
      : [];
    const matchedCities = cityList.filter(c =>
      c.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCities(matchedCities);
  }
};


  const handleSelect = (name, value) => {
    if (name === 'city') {
      const pin = citiesByCountry[form.country]?.[value] || '';
      setForm(prev => ({ ...prev, city: value, pincode: pin }));
      setFilteredCities([]);
    } else if (name === 'state') {
      setForm(prev => ({ ...prev, state: value }));
      setFilteredStates([]);
    } else if (name === 'country') {
      const countryStates = statesByCountry[value] || [];
      const cityList = citiesByCountry[value]
        ? Object.keys(citiesByCountry[value])
        : [];
      setForm(prev => ({
        ...prev,
        country: value,
        state: '',
        city: '',
        pincode: ''
      }));
      setFilteredCountries([]);
      setFilteredStates(countryStates);
      setFilteredCities(cityList);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
  const newErrors = {};
  Object.entries(form).forEach(([key, val]) => {
    if (!val) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      newErrors[key] = `${label} is required`;
    }
  });
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitted(false);
    if (!validateForm()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('API Error');
      setSubmitted(true);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='app mt-4' autoComplete='off'>
      <div className='container mb-4' style={{ fontFamily: 'Montserrat' }}>
        <h2 className='fw-bold text-primary'>REGISTRATION FORM</h2>

        <div className='row mt-4 bg-light p-4 rounded'style={{marginLeft:'40px'}}>
          <div className='col-lg-6 col-sm-12'>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} value={form.name} className='form-control mt-3' />
            {errors.name && <small className="text-danger">{errors.name}</small>}

            <input type="date" name="dob" onChange={handleChange} value={form.dob} className='form-control mt-3' />
            {errors.dob && <small className="text-danger">{errors.dob}</small>}

            <input type="text" name="age" placeholder="Age" value={form.age} onChange={handleChange} className='form-control mt-3' />
            {errors.age && <small className="text-danger">{errors.age}</small>}

            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} value={form.email} className='form-control mt-3' />
            {errors.email && <small className="text-danger">{errors.email}</small>}

            <select name="gender" value={form.gender} onChange={handleChange} className='form-control mt-3'>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <small className="text-danger">{errors.gender}</small>}
          </div>

          <div className='col-lg-6 col-sm-12'>
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
              <div className="suggestions-list position-relative">
                {filteredCountries.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('country', c)} className="suggestion-item">
                    {c}
                  </div>
                ))}
              </div>
            )}
            {errors.country && <small className="text-danger">{errors.country}</small>}

            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleChange}
              value={form.state}
              onFocus={() => {
                if (form.country && statesByCountry[form.country]) {
                  setFilteredStates(statesByCountry[form.country]);
                }
              }}
              className='form-control mt-3'
            />
            {filteredStates.length > 0 && (
              <div className="suggestions-list position-relative">
                {filteredStates.map((s, i) => (
                  <div key={i} onClick={() => handleSelect('state', s)} className="suggestion-item">
                    {s}
                  </div>
                ))}
              </div>
            )}
            {errors.state && <small className="text-danger">{errors.state}</small>}

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              value={form.city}
              onFocus={() => {
                const cityList = citiesByCountry[form.country] ? Object.keys(citiesByCountry[form.country]) : [];
                setFilteredCities(cityList);
              }}
              className='form-control mt-3'
            />
            {filteredCities.length > 0 && (
              <div className="suggestions-list position-relative">
                {filteredCities.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('city', c)} className="suggestion-item">
                    {c}
                  </div>
                ))}
              </div>
            )}
            {errors.city && <small className="text-danger">{errors.city}</small>}

            <input type="text" name="pincode" placeholder="Pin-Code" onChange={handleChange} value={form.pincode} className='form-control mt-3' />
            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}

            <textarea name="address" placeholder="Address" onChange={handleChange} value={form.address} className='form-control mt-3' rows={3} />
            {errors.address && <small className="text-danger">{errors.address}</small>}
          </div>
        </div>

        {submitted && (
          <div className="alert alert-success fw-bold text-center mt-2" role="alert">
            Registered successfully!
          </div>
        )}


        <div className='text-center mt-2'style={{marginLeft:'100px'}}>
          <button type="submit" className="btn btn-primary fw-bold me-3">Submit</button>
          <button type="button" className="btn btn-light fw-bold" onClick={showDetails}>Show Details</button>
        </div>
      </div>
    </form>
  );
}

export default RegistrationForm;


