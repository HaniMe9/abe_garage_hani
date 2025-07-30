// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../Contexts/AuthContext";
// import { NavDropdown } from "react-bootstrap";
// import { FaBars, FaChevronDown, FaUser, FaSignOutAlt } from "react-icons/fa";
// import { RiAccountCircleFill } from "react-icons/ri";
// import loginService from "../../services/login.service";
// import logo from "../../assets/images/logo.png";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Style from "./Header.module.css";

// // Profile Image component
// // const ProfileImage = ({ user }) => {
// //     return (
// //         <div className={Style.profileImgWrapper}>
// //             <div className={Style.profileImgContainer}>
// //                 {user.profileimg ? (
// //                     <img
// //                         src={`${axiosImageURL}${user.profileimg}`}
// //                         className={Style.profileImg}
// //                         alt="Profile Image"
// //                         loading="lazy"
// //                     />
// //                 ) : (
// //                     <RiAccountCircleFill className={Style.profileImgCircle} />
// //                 )}
// //             </div>
// //             <div className={Style.profileArrow}>
// //                 <FontAwesomeIcon icon={faChevronDown} className={Style.arrowIcon} />
// //             </div>
// //         </div>
// //     );
// // };

// const Header = () => {

//     // Access the authentication context
//     const { isLogged, setIsLogged, employee, isAdmin, isManager } = useAuth();

//     // Log out event handler function
//     const logOut = async () => {
//         await loginService.logOut();
//         setIsLogged(false);
//     };

//     // Function to get the role text
//     const getRoleText = () => {
//         if (isAdmin) return "Admin";
//         if (isManager) return "Manager";
//         return "Mechanic";
//     };

//     // Function to get the dashboard route
//     const getDashboardRoute = () => {
//         if (isAdmin) return "/admin-dashboard";
//         if (isManager) return "/employee-dashboard";
//         return "/customer-dashboard";
//     };

//     // Function to get the dashboard label and icon
//     const getDashboardLabel = () => {
//         if (isAdmin) return <><FaUser style={{marginRight: '5px'}}/> Admin Dashboard</>;
//         if (isManager) return <><FaUser style={{marginRight: '5px'}}/> Manager Dashboard</>;
//         return <><FaUser style={{marginRight: '5px'}}/> Dashboard</>;
//     };

//     return (
//         <header className={Style.header}>
//             <div className={Style.topBar}>
//                 <div className={Style.leftTopBar}>
//                     <div className={`${Style.tagline} d-none d-lg-block`}>
//                         Enjoy the Beso while we fix your car
//                     </div>
//                     <div className={Style.workingHours}>
//                         Monday - Saturday | 7:00AM - 6:00PM
//                     </div>
//                 </div>
//                 <div> 
//                     {isLogged ? (
//                         <div className={Style.contactInfo}>
//                             Welcome: <strong>{employee?.employee_first_name}</strong>
//                         </div>
//                     ) : (
//                         <div className={Style.contactInfo}>
//                             Call: <strong>+251 921 259 229</strong>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <div className={Style.mainHeader}>
//                 <NavDropdown title={<FaBars size={35} />} className="d-md-none">
//                     <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
//                     {isLogged && (
//                         <NavDropdown.Item as={Link} to={getDashboardRoute()}>{getDashboardLabel()}</NavDropdown.Item>
//                     )}
//                     <NavDropdown.Item as={Link} to="/about-us">About Us</NavDropdown.Item>
//                     <NavDropdown.Item as={Link} to="/abe-services">Services</NavDropdown.Item>
//                     <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
//                     {!isLogged && <NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>}
//                     {!isLogged && <NavDropdown.Item as={Link} to="/login">Sign In</NavDropdown.Item>}
//                 </NavDropdown>
//                 <Link to="/"><img src={logo} alt="ABE Garage Logo" loading="lazy" /></Link>
//                 <div className={Style.navMenu}>
//                     <ul className="d-none d-md-flex">
//                         <li><Link to="/">Home</Link></li>
//                         {isLogged && (
//                             <li><Link to={getDashboardRoute()}>{getDashboardLabel()}</Link></li>
//                         )}
//                         <li><Link to="/about-us">About Us</Link></li>
//                         <li><Link to="/abe-services">Services</Link></li>
//                         <li><Link to="/contact-us">Contact Us</Link></li>
//                     </ul>
//                     <div>
//                         {isLogged ? (
//                             <NavDropdown
//                                 title={<div className={Style.profileImgWrapper}>
//                                     <div className={Style.profileImgContainer}>
//                                         {employee.profileimg ? (
//                                             <img
//                                                 src={`${axiosImageURL}${user.profileimg}`}
//                                                 className={Style.profileImg}
//                                                 alt="Profile Image"
//                                                 loading="lazy"
//                                             />
//                                         ) : (
//                                             <RiAccountCircleFill className={Style.profileImgCircle} />
//                                         )}
//                                     </div>
//                                     <div className={Style.profileArrow}>
//                                         <FaChevronDown className={Style.arrowIcon} />
//                                     </div>
//                                 </div>}
//                             >
//                                 <NavDropdown.Item as={Link} to="/Account">
//                                     <span className={Style.icon}>
//                                         <FaUser />
//                                     </span>
//                                     Account Settings
//                                 </NavDropdown.Item>
//                                 <NavDropdown.Item onClick={logOut}>
//                                     <span className={Style.icon}>
//                                         <FaSignOutAlt />
//                                     </span>
//                                     Logout
//                                 </NavDropdown.Item>
//                             </NavDropdown>
//                         ) : (
//                             <>
//                                 <Link to="/register" className={Style.registerButton}>Register</Link>
//                                 <Link to="/login" className={Style.signInButton}>Sign In</Link>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;
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
