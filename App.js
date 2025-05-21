import React, { useState } from 'react'; 
import './App.css';
import Content from './components/Content'; 
import Form from './components/Form';      

function App() {
  const [showTable, setShowTable] = useState(false);

  return (
    <div>
      {showTable ? (
        <Form goBack={() => setShowTable(false)} />
      ) : (
        <Content showDetails={() => setShowTable(true)} />
      )}
    </div>
  );
}

export default App;
