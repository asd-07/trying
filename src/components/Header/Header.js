import React, { useState } from "react";
import { Navbar, Nav, DropdownButton, Dropdown, Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, updatePassword, updateProfile } from "firebase/auth";
import ProfilePictureModal from "../Profile";
import { Link } from "react-router-dom";
const Header = () => {
  const { logOut, user, loading } = useUserAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    const auth = getAuth();
    if (user) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setShowPasswordModal(false);
        setErrorMessage("");
      } catch (error) {
        console.error("Error updating password:", error);
        setErrorMessage(error.message);
      }
    }
  };

  const handleProfileUpdate = async () => {
    const auth = getAuth();
    if (user && (newDisplayName !== "" || newPhotoURL !== "")) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName !== "" ? newDisplayName : user.displayName,
          photoURL: newPhotoURL !== "" ? newPhotoURL : user.photoURL,
        });
        setShowProfileModal(false);
        setNewDisplayName("");
        setNewPhotoURL("");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <Navbar bg="dark" expand="lg" className="fixed-top">
      <Navbar.Brand href="#" className="brand-name" >Parmaan</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mx-auto">
                <Link to="/orgAdmin" className="nav-link">Org Admin</Link>
                <Link to="/IAMRole" className="nav-link">IAM Role</Link>
                <Link to="/assessment" className="nav-link">Assessment</Link>
                <Link to="/Analysis" className="nav-link">Analysis</Link>
              </Nav>
        {user && (
          <Nav className="ms-auto">
            <DropdownButton
              align="end"
              title={<img src={user.photoURL} alt="Profile" className="profile-image" />}
              id="dropdown-menu-align-end"
              variant="secondary"
              className="profile-dropdown"
            >
              <Dropdown.Header>
                <strong>{user.email}</strong>
               
              </Dropdown.Header>
              <hr style={{margin:0}} />
              <Dropdown.Item onClick={() => setShowProfileModal(true)}>Change Profile Photo</Dropdown.Item>
              <Dropdown.Item onClick={() => setShowPasswordModal(true)}>Change Password</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </DropdownButton>
          </Nav>
        )}
      </Navbar.Collapse>

      {/* Modal for changing password */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isInvalid={!!errorMessage}
              />
              <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm New Passwrod"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!errorMessage}
              />
              <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Close</Button>
          <Button variant="primary" onClick={handlePasswordChange}>Change Password</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for changing profile picture */}
      <ProfilePictureModal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        setNewDisplayName={setNewDisplayName}
        setNewPhotoURL={setNewPhotoURL}
      />
      
    </Navbar>
  );
};

export default Header;
