import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { getAuth, updatePassword } from "firebase/auth";
import ProfilePictureModal from "./Profile";
import { ButtonGroup, Table } from 'react-bootstrap';
import Address from "./Address";
import { red } from "@mui/material/colors";
import delete1 from '../Images/delete1.png';
import edit1 from '../Images/edit.png';

//for storing the data into the database
import collections from "../collections";

const OrgAdminComponent = () => {
  const { logOut, user, setUser, loading } = useUserAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [orgAdmins, setOrgAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrg, setNewOrg] = useState({
    orgName: '',
    adminName: '',
    oID: '',
    email: '',
    adminNo: '',
    address: {
      state: '',
      district: '',
      pincode: '',
    },
  });
  const [editOrg, setEditOrg] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(collections.users, user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    const fetchOrgAdmins = async () => {
      try {
        const querySnapshot = await getDocs((collections.organizations));
        const admins = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          address: doc.data().address || {
            state: '',
            district: '',
            pincode: '',
          },
        }));
        setOrgAdmins(admins);
      } catch (error) {
        console.error('Error fetching organization admins: ', error);
      }
    };

    fetchUserData();
    fetchOrgAdmins();
  }, [user]);

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

  const handleAddOrg = async () => {
    // console.log('Attempting to add organization:', newOrg);
    if (validateForm()) {
      console.log('Form validated successfully');
      const existingOrg = orgAdmins.find(org => org.orgName === newOrg.orgName);
      if (existingOrg && existingOrg.oID !== newOrg.oID) {
        alert('The Org ID must match the existing Org ID for this organization name.');
        return;
      }
      const existOrg = orgAdmins.find(org => org.email === newOrg.email);
      if (existOrg) {
        alert('An organization with this email already exists.');
        return;
      }
      try {
        const docRef = await addDoc(collections.organizations, {
          orgName: newOrg.orgName,
          adminName: newOrg.adminName,
          oID: newOrg.oID,
          email: newOrg.email,
          
          address: {
            state: newOrg.address.state,
            district: newOrg.address.district,
            pincode: newOrg.address.pincode,
            localAddress: newOrg.address.localAddress,
          },
          adminNo: newOrg.adminNo,
        });
        setOrgAdmins([...orgAdmins, {
          id: docRef.id,
          ...newOrg
        }]);
        setShowModal(false);
        resetForm();
        resetForm();
        console.log('Organization created successfully');
      } catch (error) {
        console.error('Error creating organization: ', error);
      }
    } else {
      console.log("Form validation failed. Errors:", errors)
    }
  };

  const handleDeleteOrg = async (orgId) => {
    if (window.confirm("Are you sure you want to delete this organization?")){
    try {
      await deleteDoc(doc(collections.organizations, orgId));
      setOrgAdmins(orgAdmins.filter(org => org.id !== orgId));
      console.log('Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization: ', error);
    }
  }
  };

  const handleEditOrg = (org) => {
     
      setEditOrg(org);
      setShowModal(true);
      setNewOrg({
        orgName: org.orgName,
        adminName: org.adminName,
        oID: org.oID,
        email: org.email,
        adminNo: org.adminNo,
        address: {
          state: org.address ? org.address.state : '',
          district: org.address ? org.address.district : '',
          pincode: org.address ? org.address.pincode : '',
          localAddress: org.address ? org.address.localAddress: '',
        },
      });
    
  };

  const updateOrganization = async () => {
    if (window.confirm("Are you sure you want to update this organization?")){
    if (validateForm()) {
      const existingOrg = orgAdmins.find(org => org.orgName === newOrg.orgName && org.id !== editOrg.id);
      if (existingOrg && existingOrg.oID !== newOrg.oID) {
        alert('The Org ID must match the existing Org ID for this organization name.');
        return;
      }
      try {
        await updateDoc(doc(collections.organizations, editOrg.id), {
          orgName: newOrg.orgName,
          adminName: newOrg.adminName,
          oID: newOrg.oID,
          email: newOrg.email,
          address: newOrg.address,
          adminNo: newOrg.adminNo,
        });

        const updatedOrgs = orgAdmins.map(org => {
          if (org.id === editOrg.id) {
            return {
              id: org.id,
              orgName: newOrg.orgName,
              adminName: newOrg.adminName,
              oID: newOrg.oID,
              email: newOrg.email,
              address: newOrg.address,
              adminNo: newOrg.adminNo,
            };
          }
          return org;
        });

        setOrgAdmins(updatedOrgs);
        setShowModal(false);
        resetForm();
        setEditOrg(null);
        console.log('Organization updated successfully');
      } catch (error) {
        console.error('Error updating organization: ', error);
      }
    }
  }
  };

  
const validateForm = () => {
  const newErrors = {};
  if (!newOrg.orgName) newErrors.orgName = 'Organization Name is required';
  if (!newOrg.adminName) newErrors.adminName = 'Admin Name is required';
  if (!newOrg.oID) newErrors.oID = 'Org ID is required';
  if (!newOrg.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(newOrg.email)) {
    newErrors.email = 'Email address is invalid';
  }
  if (!newOrg.adminNo) {
    newErrors.adminNo = 'Admin Contact Number is required';
  } else if (!/^\d{10}$/.test(newOrg.adminNo)) {
    newErrors.adminNo = 'Admin Contact Number should be 10 digits';
  }
  
  if (!newOrg.address.state) newErrors.state = 'State is required';
  if (!newOrg.address.district) newErrors.district = 'District is required';
  if (!newOrg.address.pincode) newErrors.pincode = 'Pincode is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const resetForm = () => {
    setNewOrg({
      orgName: '',
      adminName: '',
      oID: '',
      email: '',
       
      adminNo: '',
      address: {
        state: '',
        district: '',
        pincode: '',
      },
    });
    setErrors({});
  };

  const handleChange = (key, value) => {
    if (key.startsWith('address.')) {
      const addressKey = key.split('.')[1]; // Extract the actual address field (state, district, pincode)
      setNewOrg(prevOrg => ({
        ...prevOrg,
        address: {
          ...prevOrg.address,
          [addressKey]: value,
        },
      }));
    } else {
      setNewOrg(prevOrg => ({
        ...prevOrg,
        [key]: value,
      }));
    }
  };
  const handleShowAddOrgModal = () => {
    setShowModal(true);
    resetForm(); // Reset form state when adding a new organization
    setEditOrg(null); // Clear any previous edit state
  };
  
  
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Navbar bg="dark" expand="lg" className="fixed-top">
            <Navbar.Brand href="#"   className="brand-name">Parmaan</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
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
                      {/* <strong>Welcome, {user.displayName}!</strong> */}
                      <div><strong>{user.email}</strong></div>
                      <div>Role: SuperAdmin</div>
                      <Dropdown.Divider />
                    </Dropdown.Header>
                    <Dropdown.Item onClick={() => setShowProfileModal(true)}>Change Profile Photo</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowPasswordModal(true)}>Change Password</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                  </DropdownButton>
                </Nav>
              )}
            </Navbar.Collapse>
          </Navbar>

          <div style={{ marginTop: '100px' }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems:'center'
            }}>
            <h2>Organization Registered</h2>
            <Button variant="primary" onClick={handleShowAddOrgModal}>Add New Organization</Button>
            </div>
            <div style={{overflow:'auto', maxHeight: '450px', marginTop: 10}}>
            <Table striped bordered hover>
              <thead className="sticky-top">
                <tr>
                  <th>Organization Name</th>
                  <th>Admin Name</th>
                  <th>Org Registration ID</th>
                  <th>Email</th>
                  <th>Admin Contact</th>
                  <th>Address</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgAdmins.map(org => (
                  <tr key={org.id}>
                    <td>{org.orgName}</td>
                    <td>{org.adminName}</td>
                    <td>{org.oID}</td>
                    <td>{org.email}</td>
                    <td>{org.adminNo}</td>
                    {/* <td>{org.adminAdd}</td> */}
                    {/* <td>{org.orgAdd}</td> */}
                    <td>{org.address.localAddress},{org.address.state}, {org.address.district}, {org.address.pincode}</td>
                    <td>
                        <ButtonGroup>
                          <Button variant="light" onClick={() => handleEditOrg(org)} >
                            <img src={edit1} alt="Edit" style={{ width: 20, height: 20, margin: '0', verticalAlign: 'middle'}} />
                          </Button>
                          <Button variant="light" onClick={() => handleDeleteOrg(org.id)}>
                            <img src={delete1} alt="Delete" style={{ width: 25, height: 20 }} />
                          </Button>
                        </ButtonGroup>
                      </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          </div>

         
         
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editOrg ? 'Edit Organization' : 'Add New Organization'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Organization Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization name"
                    value={newOrg.orgName}
                    onChange={(e) => setNewOrg({ ...newOrg, orgName: e.target.value })}
                    isInvalid={!!errors.orgName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.orgName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Admin Name"
                    value={newOrg.adminName}
                    onChange={(e) => setNewOrg({ ...newOrg, adminName: e.target.value })}
                    isInvalid={!!errors.adminName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.adminName}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Org ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Organization ID"
                    value={newOrg.oID}
                    onChange={(e) => setNewOrg({ ...newOrg, oID: e.target.value })}
                    isInvalid={!!errors.oID}
                  />
                  <Form.Control.Feedback type="invalid">{errors.oID}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Organization Email"
                    value={newOrg.email}
                    onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Admin contact number"
                    value={newOrg.adminNo}
                    onChange={(e) => setNewOrg({ ...newOrg, adminNo: e.target.value })}
                    isInvalid={!!errors.adminNo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.adminNo}</Form.Control.Feedback>
                </Form.Group>
               
                {/* <Form.Group className="mb-3">
                  <Form.Label>Org Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrg.orgAdd}
                    onChange={(e) => setNewOrg({ ...newOrg, orgAdd: e.target.value })}
                    isInvalid={!!errors.orgAdd}
                  />
                  <Form.Control.Feedback type="invalid">{errors.orgAdd}</Form.Control.Feedback>
                </Form.Group> */}
               <Address
                  address={newOrg.address}
                  setAddress={(updatedAddress) => setNewOrg({ ...newOrg, address: updatedAddress })}
                  errors={errors}
                  handleChange={handleChange} // Remove the extra equals sign here
                />

              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              <Button variant="primary" onClick={editOrg ? updateOrganization : handleAddOrg}>
                {editOrg ? 'Update Organization' : 'Add Organization'}
              </Button>
            </Modal.Footer>
          </Modal>

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
                    placeholder="Confirm New Password"
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

          <ProfilePictureModal show={showProfileModal} onHide={() => setShowProfileModal(false)} />
        </>
      )}
      <footer className="bg-dark text-white text-center p-3 mt-5" style={{position: 'fixed', bottom:0, left:0, right:0}}>
        
        <div >Copyright &copy; {new Date().getFullYear()} Navriti Technologies. All rights reserved.</div>
      </footer>

    
    </>
  );
};

export default OrgAdminComponent;
