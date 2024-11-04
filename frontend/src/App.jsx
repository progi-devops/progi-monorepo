import React from 'react';
import logo from '../public/react.svg';
import './App.css';

function App() {
  React.useEffect(() => {
    fetch('/api/test')
      .then(response => response.text())
      .then(message => {
        setMessage(message)
        console.log(message)
      })
  }, []);

  const [message, setMessage] = React.useState("API not available.");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          {message}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
