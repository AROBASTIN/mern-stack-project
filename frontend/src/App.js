import React from 'react';
import './App.css';
import Header from './components/Header';
import Profilecard from './components/Profilecard';
import Lap from './components/Lap';
import Summ from './components/Summ';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <Header />
      <Profilecard />
      {/* <Lap name="Rahul" age={21} description="Trying to learn React" />
      <Lap name="Priya" age={22} description="Full Stack Developer" />
      <Summ name="Summary 1" age={20} description="This is a summary component" /> */}
      <Register />
    </div>
  );
}

export default App;
