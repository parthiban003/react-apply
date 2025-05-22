import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const citiesByCountry = {
  // same as before...
};

const statesByCountry = {
  India: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Rajasthan', 'Gujarat', 'Punjab', 'Uttar Pradesh'],
  America: ['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
  England: ['Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire', 'Merseyside', 'South Yorkshire', 'Bristol', 'Tyne and Wear'],
  Afghanistan: ['Kabul', 'Kandahar', 'Herat', 'Balkh', 'Nangarhar', 'Kunduz', 'Ghazni', 'Bamyan', 'Baghlan', 'Farah'],
  Zimbabwe: ['Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central', 'Masvingo', 'Matabeleland North', 'Midlands']
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
        setAllCountries(countries);
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'age' && !/^\d*$/.test(value)) return;

    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'country') {
      setFilteredCountries(allCountries.filter(c => c.toLowerCase().startsWith(value.toLowerCase())));
      setFilteredStates([]);
      setFilteredCities([]);
      setForm(prev => ({ ...prev, state: '', city: '', pincode: '' }));
    }

    if (name === 'state') {
      const stateList = statesByCountry[form.country] || [];
      setFilteredStates(stateList.filter(s => s.toLowerCase().startsWith(value.toLowerCase())));
    }

    if (name === 'city') {
      const cityList = citiesByCountry[form.country] ? Object.keys(citiesByCountry[form.country]) : [];
      setFilteredCities(cityList.filter(c => c.toLowerCase().startsWith(value.toLowerCase())));
    }
  };

  const handleSelect = (name, value) => {
    if (name === 'city') {
      const pin = citiesByCountry[form.country]?.[value] || '';
      setForm(prev => ({ ...prev, city: value, pincode: pin }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    if (name === 'country') setFilteredCountries([]);
    if (name === 'state') setFilteredStates([]);
    if (name === 'city') setFilteredCities([]);
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      if (!val) newErrors[key] = '*This field is required';
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
    <form onSubmit={handleSubmit} className='app mt-5' autoComplete='off'>
      <div className='container mb-4' style={{ fontFamily: 'Montserrat' }}>
        <h2 className='fw-bold text-primary mb-4'>REGISTRATION FORM</h2>

        {submitted && (
          <div className="alert alert-success fw-bold text-center" role="alert">
            Registered successfully!
          </div>
        )}

        <div className='row mt-4 bg-light p-4 rounded'>
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
            {/* Country Input */}
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
              <div className="suggestions-list position-relative bg-white border rounded p-2">
                {filteredCountries.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('country', c)} className="suggestion-item py-1 px-2">
                    {c}
                  </div>
                ))}
              </div>
            )}
            {errors.country && <small className="text-danger">{errors.country}</small>}

            {/* State Input */}
            <input
              type="text"
              name="state"
              placeholder="State"
              onChange={handleChange}
              value={form.state}
              onFocus={() => {
                const stateList = statesByCountry[form.country] || [];
                setFilteredStates(stateList);
              }}
              className='form-control mt-3'
            />
            {filteredStates.length > 0 && (
              <div className="suggestions-list position-relative bg-white border rounded p-2">
                {filteredStates.map((s, i) => (
                  <div key={i} onClick={() => handleSelect('state', s)} className="suggestion-item py-1 px-2">
                    {s}
                  </div>
                ))}
              </div>
            )}
            {errors.state && <small className="text-danger">{errors.state}</small>}

            {/* City Input */}
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
              <div className="suggestions-list position-relative bg-white border rounded p-2">
                {filteredCities.map((c, i) => (
                  <div key={i} onClick={() => handleSelect('city', c)} className="suggestion-item py-1 px-2">
                    {c}
                  </div>
                ))}
              </div>
            )}
            {errors.city && <small className="text-danger">{errors.city}</small>}

            <input type="text" name="pincode" placeholder="Pin-Code" onChange={handleChange} value={form.pincode} className='form-control mt-3' readOnly />
            {errors.pincode && <small className="text-danger">{errors.pincode}</small>}

            <textarea name="address" placeholder="Address" onChange={handleChange} value={form.address} className='form-control mt-3' rows={3} />
            {errors.address && <small className="text-danger">{errors.address}</small>}
          </div>
        </div>

        <div className='text-center mt-4'>
          <button type="submit" className="btn btn-primary fw-bold me-3">Submit</button>
          <button type="button" className="btn btn-light fw-bold" onClick={showDetails}>Show Details</button>
        </div>
      </div>
    </form>
  );
}

export default RegistrationForm;
