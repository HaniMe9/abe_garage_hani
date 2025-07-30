import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import getAuth from "../util/auth"; // Adjust the path based on your project structure

const PrivateAuthRoute = ({ roles = [], children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const employee = await getAuth(); // This should return an object like { employee_token, employee_role }

        if (employee?.employee_token) {
          setIsLogged(true);

          if (roles.length === 0 || roles.includes(employee.employee_role)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsLogged(false);
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsLogged(false);
        setIsAuthorized(false);
      } finally {
        setIsChecked(true);
      }
    };

    checkAuthentication();
  }, [roles]);

  // While checking, show nothing or a loader
  if (!isChecked) {
    return null; // Or return <LoadingSpinner />
  }

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateAuthRoute;
