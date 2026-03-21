import React, { useState } from 'react';
import { login, sendOtp, verifyOtp } from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email/password, 2: OTP method choice, 3: OTP entry
  const [otpMethod, setOtpMethod] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      // After successful password check, proceed to choose OTP method
      setIdentifier(email); // default identifier is email, but we'll let user choose
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp(identifier, otpMethod);
      setStep(3);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(identifier, otp);
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      // Redirect based on role
      if (role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Invalid OTP');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {step === 1 && (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      )}
      {step === 2 && (
        <div>
          <p>Choose OTP method:</p>
          <label>
            <input type="radio" name="method" value="email" onChange={() => setOtpMethod('email')} />
            Email OTP
          </label>
          <label>
            <input type="radio" name="method" value="phone" onChange={() => setOtpMethod('phone')} />
            Phone OTP
          </label>
          {otpMethod && (
            <>
              {otpMethod === 'phone' && (
                <input
                  type="tel"
                  placeholder="Phone number (with country code)"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              )}
              <button onClick={handleSendOtp}>Send OTP</button>
            </>
          )}
        </div>
      )}
      {step === 3 && (
        <div>
          <p>Enter OTP sent to {identifier}</p>
          <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;