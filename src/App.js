import logo from './logo.svg';
import './App.css';
import Routes from './routes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>{process.env.REACT_APP_TITLE}</p>
        <Routes />

      </header>
    </div>
  );
}

export default App;
