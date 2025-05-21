// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const citiesByCountry = {
//   India: { Delhi: '110001', Mumbai: '400001', Bangalore: '560001', Chennai: '600001', Kolkata: '700001', Hyderabad: '500001', Pune: '411001', Ahmedabad: '380001', Coimbatore: '641001', Jaipur: '302001' },
//   America: { 'New York': '10001', 'Los Angeles': '90001', Chicago: '60601', Houston: '77001', Phoenix: '85001', Philadelphia: '19019', 'San Antonio': '78201', 'San Diego': '92101', Dallas: '75201', 'San Jose': '95101' },
//   England: { London: 'EC1A 1BB', Birmingham: 'B1 1AA', Manchester: 'M1 1AE', Leeds: 'LS1 1UR', Liverpool: 'L1 1JR', Sheffield: 'S1 1WB', Bristol: 'BS1 4ST', Newcastle: 'NE1 4LP', Nottingham: 'NG1 1AA', Leicester: 'LE1 1AA' },
//   Afghanistan: { Kabul: '1001', Kandahar: '3801', Herat: '2001', 'Mazar-i-Sharif': '1701', Jalalabad: '2601', Kunduz: '2501', Ghazni: '2301', Bamyan: '2401', Baghlan: '2201', Farah: '2101' },
//   Zimbabwe: { Harare: '00263', Bulawayo: '00264', Chitungwiza: '00265', Mutare: '00266', Gweru: '00267', Kwekwe: '00268', Masvingo: '00269', Chinhoyi: '00270', Marondera: '00271', Norton: '00272' }
// };

// const API_URL = 'https://682c6773d29df7a95be6e6ee.mockapi.io/user';

// const RegistrationForm = ({ showDetails }) => {
//   const initForm = { name: '', age: '', dob: '', email: '', gender: '', address: '', country: '', city: '', pincode: '' };
//   const [form, setForm] = useState(initForm);
//   const [errors, setErrors] = useState({});
//   const [countries, setCountries] = useState([]);
//   const [suggestions, setSuggestions] = useState({ countries: [], cities: [] });
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     fetch('https://restcountries.com/v3.1/all')
//       .then(res => res.json())
//       .then(data => setCountries(data.map(c => c.name.common).sort()));
//   }, []);

//   const handleChange = ({ target: { name, value } }) => {
//     if (name === 'age' && !/^\d*$/.test(value)) return;
//     const updatedForm = { ...form, [name]: value };
//     if (name === 'country') setSuggestions(s => ({ ...s, countries: countries.filter(c => c.toLowerCase().startsWith(value.toLowerCase())) }));
//     if (name === 'city') setSuggestions(s => ({ ...s, cities: Object.keys(citiesByCountry[form.country] || {}).filter(c => c.toLowerCase().startsWith(value.toLowerCase())) }));
//     setForm(updatedForm);
//     setErrors(e => ({ ...e, [name]: '' }));
//   };

//   const handleSelect = (name, value) => {
//     const updatedForm = { ...form, [name]: value };
//     if (name === 'city') updatedForm.pincode = citiesByCountry[form.country]?.[value] || '';
//     setForm(updatedForm);
//     setSuggestions({ countries: [], cities: [] });
//     setErrors(e => ({ ...e, [name]: '' }));
//   };

//   const validate = () => {
//     const newErrors = Object.fromEntries(Object.entries(form).filter(([_, v]) => !v).map(([k]) => [k, '*Required']));
//     setErrors(newErrors);
//     return !Object.keys(newErrors).length;
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSubmitted(false);
//     if (!validate()) return;
//     try {
//       const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
//       if (!res.ok) throw new Error('Submission failed');
//       setSubmitted(true);
//       setForm(initForm);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderInput = (name, type = 'text', placeholder = '') => (
//     <div className='mt-3'>
//       <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className='form-control' autoComplete='off' />
//       {errors[name] && <small className='text-danger'>{errors[name]}</small>}
//     </div>
//   );

//   const renderSuggestions = type => suggestions[type].length > 0 && (
//     <div className='suggestions-list position-relative'>
//       {suggestions[type].map((item, i) => (
//         <div key={i} onClick={() => handleSelect(type.slice(0, -1), item)} className='suggestion-item'>{item}</div>
//       ))}
//     </div>
//   );

//   return (
//     <form onSubmit={handleSubmit} className='container mt-5'>
//       <h2 className='fw-bold text-primary'>REGISTRATION FORM</h2>
//       {submitted && <div className='alert alert-success fw-bold text-center'>Registered successfully!</div>}

//       <div className='row bg-light p-4 rounded'>
//         <div className='col-lg-6'>
//           {[renderInput('name'), renderInput('dob', 'date'), renderInput('age'), renderInput('email', 'email'), (
//             <div className='mt-3' key='gender'>
//               <select name='gender' value={form.gender} onChange={handleChange} className='form-control'>
//                 <option value=''>Select Gender</option>
//                 <option value='Male'>Male</option>
//                 <option value='Female'>Female</option>
//                 <option value='Other'>Other</option>
//               </select>
//               {errors.gender && <small className='text-danger'>{errors.gender}</small>}
//             </div>
//           )]}
//         </div>

//         <div className='col-lg-6'>
//           {['country', 'city'].map((field, i) => (
//             <div className='mt-3' key={field}>
//               <input
//                 name={field}
//                 value={form[field]}
//                 onChange={handleChange}
//                 onFocus={() => setSuggestions(s => ({ ...s, [field + 's']: field === 'city' ? Object.keys(citiesByCountry[form.country] || {}) : countries }))}
//                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                 className='form-control'
//               />
//               {renderSuggestions(field + 's')}
//               {errors[field] && <small className='text-danger'>{errors[field]}</small>}
//             </div>
//           ))}
//           {renderInput('pincode')}
//           <div className='mt-3'>
//             <textarea name='address' value={form.address} onChange={handleChange} placeholder='Address' className='form-control' rows={3} />
//             {errors.address && <small className='text-danger'>{errors.address}</small>}
//           </div>
//         </div>
//       </div>

//       <div className='text-center mt-4'>
//         <button type='submit' className='btn btn-primary fw-bold me-3'>Submit</button>
//         <button type='button' className='btn btn-light fw-bold' onClick={showDetails}>Show Details</button>
//       </div>
//     </form>
//   );
// };

// export default RegistrationForm;
