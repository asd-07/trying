import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import emailjs from 'emailjs-com';
import Header from './Header/Header';
import { Container, Row, Col } from 'react-bootstrap';
import ProfilePictureModal from './Profile';
import './IAMRoleComponent.css';
import config from './config';

const IAMRoleComponent = () => {
  const [role, setRole] = useState('USER');
  const [formData, setFormData] = useState({ email: '' });
  const [organizations, setOrganizations] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgsSnapshot = await getDocs(collection(db, 'organizations'));
        const orgsData = orgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrganizations(orgsData);
      } catch (error) {
        console.error('Error fetching organizations: ', error);
      }
    };

    fetchOrganizations();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        console.log('User is logged out');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({ email: '' });
  };

  const generateUsername = () => {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const sendInvite = async (formData) => {
    try {
      const username = generateUsername();
      const password = generatePassword();
  
      console.log('Generated username:', username);
      console.log('Generated password:', password);
  
      const inviteRef = await addDoc(collection(db, 'invitations'), {
        email: formData.email,
        role: role,
        username: username,
        password: password,
        createdAt: new Date(),
      });
  
      console.log('Invitation document added with ID:', inviteRef.id);
  
      const templateParams = {
        to_email: formData.email, // Make sure this matches the expected parameter name in your EmailJS template
        to_name: formData.email,  // Assuming the recipient's name is their email for this example
        from_name: 'EaseTest Team',
        username: username,
        password: password,
        link: `https://otest-39daa.firebaseapp.com/register?email=${encodeURIComponent(formData.email)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
       
      };
  
      console.log('Template parameters:', templateParams);
  
      emailjs.send(
        config.emailServiceId, // Replace with your Email Service ID
        config.emailTemplateId, // Replace with your Email Template ID
        templateParams,
        'LBhrbdnH2Nv7zPGBE' // Replace with your User ID
      )
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        alert('Invite sent successfully!');
      }, (error) => {
        console.error('Error sending email:', error);
        alert('Error sending invite');
      });
    } catch (error) {
      console.error('Error sending invite: ', error);
      alert('Error sending invite');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending invite for role:', role);

    try {
      await sendInvite(formData);
    } catch (error) {
      console.error('Error sending invite: ', error);
      alert('Error sending invite');
    }
  };

  return (
    <>
      <Header setShowProfileModal={setShowProfileModal} />
      <Container className="my-5">
        <Row>
          <Col>
            <div className="invite-form-container">
              <h2 className="invite-form-title">Send Invite for New Role</h2>
              <form onSubmit={handleSubmit} className="invite-form">
                <label className="form-label">
                  Select Role:
                  <select value={role} onChange={handleRoleChange} className="form-select">
                    <option value="USER">User</option>
                    <option value="OrgAdmin">Org Admin</option>
                    <option value="Candidate">Candidate</option>
                  </select>
                </label>
                <label className="form-label">
                  Email:
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ email: e.target.value })} required className="form-input" placeholder='Enter Email to send invitation'/>
                </label>
                <button type="submit" className="submit-button">Send Invite</button>
              </form>
              <footer className="bg-dark text-white text-center p-3 mt-5" style={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                Copyright &copy; {new Date().getFullYear()} Navriti Technologies. All rights reserved.
              </footer>
            </div>
          </Col>
        </Row>
      </Container>
      <ProfilePictureModal show={showProfileModal} handleClose={() => setShowProfileModal(false)} />
    </>
  );
};

export default IAMRoleComponent;
