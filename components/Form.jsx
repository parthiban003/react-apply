import React from 'react'

const Form = () => {
  return (
    <div>
      <table onSubmit={handleSubmit(e.target.value)}>
        <thead>
          <th>NAME</th>
          <th>AGE</th>
          <th>DOB</th>
          <th>E-Mail</th>
          <th>PASSWORD</th>
          <th>COUNTRY</th>
          <th>CITY</th>
          <th>PINCODE</th>
        </thead>
      </table>
    </div>
  )
}

export default Form