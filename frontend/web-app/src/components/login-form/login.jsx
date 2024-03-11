// Login.js
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setUsername, setPassword, setAuthenticated } from '../../store/actions/login-actions';
import Button from '../button/button';
import Input from '../input/input';
import { LOGIN_API } from '../../constants';
import { useNavigate  } from 'react-router-dom'; 
import './login.css';

const Login = ({ username, password, isAuthenticated, setUsername, setPassword, setAuthenticated }) => {
    

    const [bWrongPassword, setWrongPassword] = useState(false);

    const localStorage = window.localStorage;

    const navigate = useNavigate ();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        // Call the login API
        // If successful, set the isAuthenticated state to true
        fetch(LOGIN_API, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                // Update isAuthenticated state to true
                setAuthenticated(true);
                response.json().then(data => {
                    localStorage.setItem('accessToken', data.accessToken);
                }).then (() => {
                    navigate('/user/profile');
                });
                setWrongPassword(false);
            } else {
                // Update isAuthenticated state to false
                console.log('wrong password');
                setAuthenticated(false);
                //  Wrong password 
                setWrongPassword(true);
            }
            console.log(response);
        }).catch(error => {
            // Handle any errors from the fetch request
            console.error('Error:', error);
        });
    };

    return (
        <div>
            <div className='login-form'>
                <h3>Register/Login</h3>
                <Input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
                <Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <Button text="Login" onClick={handleLogin} />
                {bWrongPassword && <p>Invalid Password</p>}
            </div>
        </div>
    );
}


const mapStateToProps = state => ({
    username: state.login.username,
    password: state.login.password,
    isAuthenticated: state.isAuthenticated
});

const mapDispatchToProps = {
    setUsername,
    setPassword,
    setAuthenticated
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
