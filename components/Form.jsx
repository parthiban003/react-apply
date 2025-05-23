import React, { useEffect, useState } from 'react';

function UserTable({ goBack }) {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetch('https://682c6773d29df7a95be6e6ee.mockapi.io/user')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleDelete = (id) => {
    fetch(`https://682c6773d29df7a95be6e6ee.mockapi.io/user/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setUsers(users.filter(user => user.id !== id));
    });
  };

  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch(`https://682c6773d29df7a95be6e6ee.mockapi.io/user/${editUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedUser)
    })
    .then(res => res.json())
    .then(updated => {
      setUsers(users.map(user => user.id === editUserId ? updated : user));
      setEditUserId(null);
      setEditedUser({});
    });
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedUser({});
  };

  return (
    <div className="container mt-3">
      <h2 className='text-center mb-4 fw-bold text-primary'>User Details</h2>
      <div className="text-center mb-4">
        <button className="btn btn-secondary fw-bold" onClick={goBack} style={{ marginLeft: '110px' }}>Back to Form</button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>DOB</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Pin-Code</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                {editUserId === user.id ? (
                  <>
                    <td><input name="name" value={editedUser.name} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="age" value={editedUser.age} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="dob" value={editedUser.dob} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="email" value={editedUser.email} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="gender" value={editedUser.gender} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="country" value={editedUser.country} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="country" value={editedUser.state} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="city" value={editedUser.city} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="pincode" value={editedUser.pincode} onChange={handleInputChange} className="form-control" /></td>
                    <td><input name="address" value={editedUser.address} onChange={handleInputChange} className="form-control" /></td>
                    <td>
                      <button className="btn bg-success btn-sm me-1" onClick={handleSave}>Save</button>
                      <button className="btn bg-warning btn-sm mt-1" onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.dob}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.country}</td>
                    <td>{user.state}</td>
                    <td>{user.city}</td>
                    <td>{user.pincode}</td>
                    <td>{user.address}</td>
                    <td>
                      <button className=" btn-primary btn-sm me-1" onClick={() => handleEditClick(user)}>Edit</button>
                      <button className=" btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center text-muted">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
