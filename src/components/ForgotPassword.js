import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { auth } from "../firebase"; // Adjust the path according to your project structure
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth"; // Import from Firebase/Auth

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true); // Set loading state to true
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        navigate("/");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Reset loading state after completion
    }
  };
  
  

  return (
    <>
    <div className="forgotp">
      <div className="p-4 box">
        <h2 className="rp">Reset Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Reset Password
            </Button>
          </div>
        </Form>
        <div className="  mt-3 text-center">
          Remembered your password? <Link to="/">Log In</Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default ForgotPassword;
