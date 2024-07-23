import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [email, setEmail] = useState(queryParams.get('email') || '');
  const [username, setUsername] = useState(queryParams.get('username') || '');
  const [password, setPassword] = useState(queryParams.get('password') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(queryParams.get('email') || '');
    setUsername(queryParams.get('username') || '');
    setPassword(queryParams.get('password') || '');
  }, [location.search]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        username,
        role: 'USER',
        // Add other fields as needed
      });

      alert('Registration successful!');
    } catch (error) {
      console.error('Error registering: ', error);
      alert('Error registering: ', error.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
