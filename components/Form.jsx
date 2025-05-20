import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

const Form = () => {

  const table = JSON.parse(localStorage.getItem('user1')) || [];
  console.log(table);

  for (var i=0; i<=table.length; i++){
    console.log(table[i]);
    $('#body').append(
      '<tr>' +
      '<td>'+table[i].name+'</td>'+
      '<td>'+table[i].age+'</td>'+
      '<td>'+table[i].dob+'</td>'+
      '<td>'+table[i].email+'</td>'+
      '<td>'+table[i].password+'</td>'+
      '<td>'+table[i].country+'</td>'+
      '<td>'+table[i].city+'</td>'+
      '<td>'+table[i].pincode+'</td>'+
    );
  }

   function add(){
    window.location.replace('Content');
   }

  return (
    <div className='col-lg-12'>
      <table className='table table-striped table-border text-light'>
        <thead>
          <tr>
            <th>NAME</th>
          <th>AGE</th>
          <th>DOB</th>
          <th>E-Mail</th>
          <th>PASSWORD</th>
          <th>COUNTRY</th>
          <th>CITY</th>
          <th>PINCODE</th>
          </tr>
        </thead>
        <tbody id='body'>

        </tbody>
      </table>
      <div className='text-center'>
        <button className='btn btn-danger fw-bold' onClick={add()}>Add Details</button>

      </div>
    </div>
  )
}

export default Form