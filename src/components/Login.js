import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { getFirebaseErrorMessage } from "./utils/firebaseErrors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for Remember Me checkbox
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      if (rememberMe) {
        localStorage.setItem("userEmail", email); // Example (not secure)
      }
      navigate("/orgAdmin");
    } catch (error) {
      console.error("Firebase login error:", error); // Log full error object
      console.log("Error code:", error.code); // Log the error code
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/orgAdmin");
    } catch (error) {
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <>
      <div className="login">
        <div className="p-4 box">
          <div className="log">
            <h2>Login</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Log In
              </Button>
            </div>
          </Form>
          <div className="fp">
            <Link to="/forgot-password" className="btn btn-link" style={{ textAlign: "center" }}>
              Forgot Password?
            </Link>
          </div>
          <hr />
          <div className="g-button">
            <GoogleButton
              className="g-btn"
              type="dark"
              style={{ width: 348 }}
              onClick={handleGoogleSignIn}
            />
          </div>
        </div>
        <div className="p-4 box mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
