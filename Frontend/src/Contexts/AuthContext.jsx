import React, {useState, useEffect, useContext, createContext, useMemo} from "react";
import getAuth from "../util/auth";

// Create a context object
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Create a provider component
export const AuthProvider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {

      // Fetch authentication details
      try {
        const loggedInEmployee = await getAuth();
        
        if (loggedInEmployee?.employee_token) {
          setIsLogged(true);

          // Check if the employee is an admin
          if (loggedInEmployee.employee_role === 4) {
            setIsAdmin(true);
          }

          // Check if the employee is a manager
          if (loggedInEmployee.employee_role === 1) {
            setIsManager(true);
          }
          setEmployee(loggedInEmployee);
        }
      } catch (error) {
        console.error("Error fetching authentication details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    isLogged,
    isAdmin,
    isManager,
    setIsAdmin,
    setIsLogged,
    employee,
    loading,
    employeeId: employee?.employee_id
  }),
    [isLogged, isAdmin, employee, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};
