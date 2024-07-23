import React, { useState } from "react";
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useUserAuth } from "../context/UserAuthContext";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePictureModal = ({ show, onHide }) => {
  const { user } = useUserAuth();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    const auth = getAuth();
    if (user && (newDisplayName.trim() !== "" || selectedFile)) {
      try {
        let photoURL = user.photoURL;

        if (selectedFile) {
          setUploading(true);
          const storage = getStorage();
          const storageRef = ref(storage, `profilePictures/${user.uid}/${selectedFile.name}`);
          await uploadBytes(storageRef, selectedFile);
          photoURL = await getDownloadURL(storageRef);
          setUploading(false);
        }

        await updateProfile(auth.currentUser, {
          displayName: newDisplayName.trim() !== "" ? newDisplayName.trim() : user.displayName,
          photoURL: photoURL,
        });

        handleClose(); // Close modal after successful update
      } catch (error) {
        console.error("Error updating profile:", error);
        setError(error.message);
        setUploading(false);
      }
    }
  };

  const handleClose = () => {
    onHide(); // Call onHide function passed as prop to close the modal
    setNewDisplayName(""); // Reset state for next use
    setSelectedFile(null);
    setError(null); // Clear any error messages
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDisplayName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new display name"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPhoto">
            <Form.Label>Profile Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleProfileUpdate} disabled={uploading}>
          {uploading ? "Uploading..." : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfilePictureModal;
