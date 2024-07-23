import React, { useState } from 'react';

const LoginPage = () => {
  const [otp, setOtp] = useState('');
  const [loginId, setLoginId] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleLoginIdChange = (e) => {
    setLoginId(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Implement login authentication logic here (e.g., verify OTP and login ID)
    console.log('Logging in with OTP:', otp, 'and Login ID:', loginId);

    // Redirect to welcome page upon successful login
    // Replace with your routing logic or redirect mechanism
    // Example:
    // history.push('/welcome');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleLoginSubmit}>
        <label>
          OTP:
          <input type="text" value={otp} onChange={handleOtpChange} required />
        </label>
        <label>
          Login ID:
          <input type="text" value={loginId} onChange={handleLoginIdChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
