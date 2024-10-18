import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData);
      console.log('response.data==>', response.data);
      console.log('Registration successful');
      setErrors({});
      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        console.error('Registration error: ', error.response.data);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again later.' });
        console.error('An unexpected error occurred', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className="row justify-content-center">
        <div className="col-md-6 bg-light-dark p-5 rounded">
          <h3 className='text-light text-center mb-4'>Create an Account</h3>

          {/* Registration Form */}
          <form onSubmit={handleRegistration} noValidate>
            {/* Username Field */}
            <div className='mb-3'>
              <label htmlFor="username" className='form-label'>Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby="usernameHelp"
                required
              />
              <small id="usernameHelp" className="form-text text-muted">Choose a unique username.</small>
              {errors.username && <div className='invalid-feedback'>{errors.username}</div>}
            </div>

            {/* Email Field */}
            <div className='mb-3'>
              <label htmlFor="email" className='form-label'>Email address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="emailHelp"
                required
              />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className='mb-3'>
              <label htmlFor="password" className='form-label'>Set password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="passwordHelp"
                required
              />
              <small id="passwordHelp" className="form-text text-muted">Make sure to use a strong password.</small>
              {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
            </div>

            {/* General Error */}
            {errors.general && <div className='text-danger mb-3' aria-live="polite">{errors.general}</div>}

            {/* Success Message */}
            {success && <div className='alert alert-success' aria-live="polite">Registration Successful</div>}

            {/* Submit Button */}
            {loading ? (
              <button type='submit' className='btn btn-info d-block mx-auto' disabled>
                <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
              </button>
            ) : (
              <button type='submit' className='btn btn-info d-block mx-auto'>Register</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
