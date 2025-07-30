import React, { useState } from "react";
import { PulseLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import NotFound from "../../Components/NotFound/NotFound";
import loginService from "../../services/login.service";
import Layout from "../../Layout/Layout";
import Styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const [employee_email, setEmail] = useState("");
  const [employee_password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Handle client side validations here
    let valid = true;

    // Email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!employee_email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!regex.test(employee_email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!employee_password) {
      setPasswordError("please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    const formData = { employee_email, employee_password };

    // Make the API call
    try {

      setLoading(true);
      setError(false);

      const response = await loginService.logIn(formData);

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          html: "You have logged in successfully",
          icon: "success",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.successTitle,
            htmlContainer: Styles.text,
          },
        });

        // Store the employee data in localStorage
        if (response.data.employee_token) {
          localStorage.setItem("employee", JSON.stringify(response.data));
        }

        // Redirect based on role
        const role = response.data.employee_role;
        if (role === 4) {
          setTimeout(() => { navigate("/admin-dashboard") }, 1500);
        } else if (role === 1) {
          setTimeout(() => { navigate("/employee-dashboard") }, 1500);
        } else {
          setTimeout(() => { navigate("/customer-dashboard") }, 1500);
        }
      } else if (response.message === "Something went wrong") {
        Swal.fire({
          title: "error!",
          html: "Unexpected error occured. Please try again!",
          icon: "error",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.errorTitle,
            htmlContainer: Styles.text,
          },
        });
      } else {
        Swal.fire({
          title: "Error!",
          html: "Incorrect email or password. Please try again!",
          icon: "error",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.errorTitle,
            htmlContainer: Styles.text,
          },
        });
      }
    } catch (err) {
      console.error(err);
      if (!err.error) {
        setError(true);
      } else {
        Swal.fire({
          title: "error!",
          html: "Unexpected error occured. Please try again!",
          icon: "error",
          customClass: {
            popup: Styles.popup,
            confirmButton: Styles.confirmButton,
            icon: Styles.icon,
            title: Styles.errorTitle,
            htmlContainer: Styles.text
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {!error ? (<section className={Styles.contactSection}>
        <div className={Styles.container}>
          <div className={Styles.sectionTitle}>
            <h2>Login to your account <span>___</span></h2>
          </div>
          <div className={Styles.contactForm}>
            <div className={Styles.innerContainer}>
              <div className={Styles.formContainer}>
                <div className={Styles.form}>
                  <form onSubmit={handleSubmit}>
                    <div className={Styles.formGroupContainer}>
                      <div className={Styles.formGroup}>
                        {emailError && (
                          <div className={Styles.error} role="alert">{emailError}</div>
                        )}
                        <input
                          type="email"
                          name="employee_email"
                          value={employee_email}
                          placeholder="Email"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                      <div className={Styles.formGroup}>
                        {passwordError && (
                          <div className={Styles.error} role="alert">{passwordError}</div>
                        )}
                        <div className={Styles.passwordContainer}>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="employee_password"
                            value={employee_password}
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                          />
                          <button
                            type="button"
                            className={Styles.togglePassword}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                      <div className={Styles.formGroup}>
                        <button
                          className={Styles.logInButton}
                          type="submit"
                        >
                          {loading ? (<PulseLoader color="white" size={12} />) : ("Login")}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span>Don't have an account? </span>
                    <Link to="/register">Register here</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>) : <NotFound />}
    </Layout>
  );
}

export default Login;
