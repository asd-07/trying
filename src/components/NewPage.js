import React from 'react';
import { Navbar, Nav, Container, Image, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For navigation links
import "./New.css"


const Header = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          {/* Logo */}
          <Navbar.Brand href="#">
            <Image src="your-logo.png" alt="Your Logo" width="50" height="50" />
          </Navbar.Brand>

          {/* Navigation Links */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {/* Add other navigation links here */}
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/about">About</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/contact">Contact</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

          {/* Profile Section */}
          <Nav>
            <Nav.Link href="#">John Doe</Nav.Link>
            <Nav.Link href="#">Settings</Nav.Link>
            <Nav.Link href="#">Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Rest of your content goes here */}

      <footer className="text-center p-3">
        &copy; 2024 Your Company Name
      </footer>
    </>
  );
};

export default Header;
