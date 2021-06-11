import logo from './logo.svg';
import './App.css';
import Routes from './routes';

function App() {
  return (
    <div className="App">
     <div className="container">
        <h3 className="text-center">{process.env.REACT_APP_TITLE}</h3>
        <Routes />
     </div>
    </div>
  );
}

export default App;
