// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserAuth } from "../context/UserAuthContext";
// import { doc, getDoc } from "firebase/firestore"; // Add this import
// import { db } from "../firebase"; // Adjust this import path as needed
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import { Link } from "react-router-dom";
// import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import { getAuth, updatePassword } from "firebase/auth";
// import ProfilePictureModal from "./Profile"; // Updated import for ProfilePictureModal
// import { lightBlue } from "@mui/material/colors";


// const Home = () => {
//   const { logOut, user, setUser, loading } = useUserAuth();
//   const navigate = useNavigate();
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [userData, setUserData] = useState({}); // State to store user data

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         const docRef = doc(db, "users", user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setUserData(docSnap.data());
//         } else {
//           console.log("No such document!");
//         }
//       }
//     };

//     fetchUserData();
//   }, [user]);

//   const handleLogout = async () => {
//     try {
//       await logOut();
//       navigate("/");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmPassword) {
//       setErrorMessage("Passwords do not match");
//       return;
//     }

//     const auth = getAuth();
//     if (user) {
//       try {
//         await updatePassword(auth.currentUser, newPassword);
//         setShowPasswordModal(false);
//         setErrorMessage("");
//       } catch (error) {
//         console.error("Error updating password:", error);
//         setErrorMessage(error.message);
//       }
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <div className="home">
//             <Navbar bg="dark" expand="lg" className="fixed-top">
//               <Navbar.Brand href="#">Your Website Name</Navbar.Brand>
//               <Navbar.Toggle aria-controls="basic-navbar-nav" />
//               <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="mx-auto">
//                   {/* <Link to="/home" className="nav-link"  >
//                     Home
//                   </Link> */}
//                   <Link to="/orgAdmin" className="nav-link">
//                     Org Admin
//                   </Link>
//                   <Link to="/IAMRole" className="nav-link">
//                     IAM Role
//                   </Link>
//                   <Link to="/assessment" className="nav-link">
//                     Assessment
//                   </Link>
//                   <Link to="/Analysis" className="nav-link">
//                     Analysis
//                   </Link>
//                 </Nav>
//                 {user && (
//                   <Nav className="ms-auto">
//                     <DropdownButton
//                       align="end"
//                       title={<img src={user.photoURL} alt="Profile" className="profile-image" />}
//                       id="dropdown-menu-align-end"
//                       variant="secondary" // Change variant to secondary
//                       className="profile-dropdown"
//                     >
//                       <Dropdown.ItemText>
//                         <div className="dropdown-email">
//                           {user.email}
//                         </div>
//                       </Dropdown.ItemText>
//                       <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
//                         Change Password
//                       </Dropdown.Item>
//                       <Dropdown.Item onClick={() => setShowProfileModal(true)}>
//                         Change Profile Picture
//                       </Dropdown.Item>
//                       <Dropdown.Divider />
//                       <Dropdown.Item onClick={handleLogout}>
//                         Log out
//                       </Dropdown.Item>
//                     </DropdownButton>
//                   </Nav>
//                 )}
//               </Navbar.Collapse>
//             </Navbar>



               
//             <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
//               <Modal.Header closeButton>
//                 <Modal.Title>Change Password</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Form>
//                   <Form.Group controlId="formNewPassword">
//                     <Form.Label>New Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Enter new password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                   </Form.Group>
//                   <Form.Group controlId="formConfirmPassword">
//                     <Form.Label>Confirm Password</Form.Label>
//                     <Form.Control
//                       type="password"
//                       placeholder="Confirm new password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                   </Form.Group>
//                   {errorMessage && <p className="text-danger">{errorMessage}</p>}
//                 </Form>
//               </Modal.Body>
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
//                   Close
//                 </Button>
//                 <Button variant="primary" onClick={handlePasswordChange}>
//                   Save Changes
//                 </Button>
//               </Modal.Footer>
//             </Modal>

//             <ProfilePictureModal 
//               show={showProfileModal} 
//               handleClose={() => setShowProfileModal(false)} 
//             />
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Home;

