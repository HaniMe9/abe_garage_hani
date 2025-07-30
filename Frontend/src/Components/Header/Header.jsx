import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { FaBars, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import loginService from "../../services/login.service";
import logo from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Style from "./Header.module.css";
import PropTypes from "prop-types";

const axiosImageURL = "https://your-api.com/uploads/"; // <-- Replace with your backend image base URL

// Profile Image as a reusable component
const ProfileImage = ({ profileImg }) => (
  <div className={Style.profileImgWrapper}>
    <div className={Style.profileImgContainer}>
      {profileImg ? (
        <img
          src={`${axiosImageURL}${profileImg}`}
          className={Style.profileImg}
          alt="Profile"
          loading="lazy"
        />
      ) : (
        <RiAccountCircleFill className={Style.profileImgCircle} />
      )}
    </div>
    <div className={Style.profileArrow}>
      <FaChevronDown className={Style.arrowIcon} />
    </div>
  </div>
);

ProfileImage.propTypes = {
  profileImg: PropTypes.string,
};

const Header = () => {
  const { isLogged, setIsLogged, employee, isAdmin, isManager } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const logOut = async () => {
    await loginService.logOut();
    setIsLogged(false);
  };

  const getDashboardRoute = () => {
    if (isAdmin) return "/admin-dashboard";
    if (isManager) return "/employee-dashboard";
    return "/customer-dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return <><FaUser style={{ marginRight: '5px' }} /> Admin Dashboard</>;
    if (isManager) return <><FaUser style={{ marginRight: '5px' }} /> Manager Dashboard</>;
    return <><FaUser style={{ marginRight: '5px' }} /> Dashboard</>;
  };

  return (
    <header className={Style.header}>
      {/* Top Bar */}
      <div className={Style.topBar}>
        <div className={Style.leftTopBar}>
          <div className={`${Style.tagline} d-none d-lg-block`}>
            Enjoy the Beso while we fix your car
          </div>
          <div className={Style.workingHours}>
            Monday - Saturday | 7:00AM - 6:00PM
          </div>
        </div>
        <div>
          {isLogged ? (
            <div className={Style.contactInfo}>
              Welcome: <strong>{employee?.employee_first_name}</strong>
            </div>
          ) : (
            <div className={Style.contactInfo}>
              Call: <strong>+251 921 259 229</strong>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Navbar */}
      <Navbar
        bg="light"
        expand="md"
        expanded={expanded}
        className={Style.mainHeader}
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="ABE Garage Logo" loading="lazy" height="50" />
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          >
            <FaBars size={28} />
          </Navbar.Toggle>

          {/* Nav Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
              {isLogged && (
                <Nav.Link as={Link} to={getDashboardRoute()} onClick={() => setExpanded(false)}>
                  {getDashboardLabel()}
                </Nav.Link>
              )}
              <Nav.Link as={Link} to="/about-us" onClick={() => setExpanded(false)}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/abe-services" onClick={() => setExpanded(false)}>Services</Nav.Link>
              <Nav.Link as={Link} to="/contact-us" onClick={() => setExpanded(false)}>Contact Us</Nav.Link>
            </Nav>

            {/* Right Side (Auth) */}
            <Nav>
              {isLogged ? (
                <NavDropdown
                  align="end"
                  title={<ProfileImage profileImg={employee?.profileimg} />}
                  id="profile-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/Account">
                    <FaUser style={{ marginRight: "8px" }} /> Account Settings
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logOut}>
                    <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link to="/register" className={Style.registerButton}>Register</Link>
                  <Link to="/login" className={Style.signInButton}>Sign In</Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
