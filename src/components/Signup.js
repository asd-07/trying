import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1"); // Default country code

  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) {
      return;
    }

    try {
      await signUp(email, password, { firstName, lastName, selectedCountryCode });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const validate = () => {
    let isValid = true;
    setError(null);

    if (!/^[A-Za-z\s-]+$/.test(firstName.trim())) {
      setError("First Name is required and can only contain letters, spaces, and hyphens.");
      isValid = false;
    }

    if (!/^[A-Za-z\s-]+$/.test(lastName.trim())) {
      setError("Last Name is required and can only contain letters, spaces, and hyphens.");
      isValid = false;
    }

    // Restrict email to @gmail.com only
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format (must be @gmail.com)");
      isValid = false;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include a lowercase letter, uppercase letter, number, and special character.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  return (
    <>
    <div className="signup">
      <div className="p-4 box">
        <div className="sign">
          <h2 className="mb-3">Sign Up</h2>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              pattern="^[A-Za-z\s]+$"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCPassword">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
      </div>
    </>
  );
};

export default Signup;
