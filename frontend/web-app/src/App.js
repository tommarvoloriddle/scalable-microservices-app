import './App.css';
import Login from './components/login-form/login';
import UserProfile from './components/user/userprofile';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAuthenticated } from './store/actions/login-actions';

const  App = ({isAuthenticated, setAuthenticated}) => {
  const localStorage = window.localStorage;
  
  if (localStorage.getItem('accessToken') !== null && isAuthenticated === false) {
    setAuthenticated(true);
  }

  return (
      
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/user/profile" /> : <Login />} />
          <Route path="/user/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/" />} />
        </Routes>
      </Router>
  );
}


const mapStateToProps = state => ({
  isAuthenticated: state.login.isAuthenticated
});

const mapDispatchToProps = {
  setAuthenticated
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
