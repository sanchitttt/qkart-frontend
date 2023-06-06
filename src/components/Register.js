import { Button, LinearProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Register.css";

const Register = () => {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  let { enqueueSnackbar } = useSnackbar();
  let [loading, setLoading] = useState(false);


  let history = useHistory();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    let dataBody = {
      "email": email,
      "name": username,
      "password": password
    }
    let validateDataBody = {
      "username": username,
      "password": password,
      "confirmPassword": confirmPassword

    }
    let result = validateInput(validateDataBody);
    if (result === true) {
      setLoading(loading = true)
      try {
        let response = await axios.post(`${config.endpoint}/auth/register`, JSON.parse(JSON.stringify(dataBody)))
        console.log(response);
        if (response.status === 201) {
          setLoading((loading = false));
          enqueueSnackbar("Registered Successfully", { variant: "success" });
          history.push('/login')

        };

      } catch (error) {
        console.log(error);
        if (error.response.status >= 400) {
          setLoading((loading = false));
          enqueueSnackbar(error.response.data.message, { variant: "error" })
        }
        else {
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" })
          setLoading((loading = false));
        }
      }
    }
  };
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username.length === 0) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: "warning" });
      return false;
    }
    if (data.password.length === 0) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 5) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
      return false;
    }
    if (data.confirmPassword !== password) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;

  };

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  }

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  }

  const confirmPasswordHandler = (event) => {
    setConfirmPassword(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
      overflow="hidden"
    >
      <Header hasHiddenAuthButtons="register" />
      <Box className="content adjustment">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Name"
            name="username"
            placeholder="Enter name"
            fullWidth
            value={username}
            onChange={usernameChangeHandler}
            className="lower-margin"
            required

          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            name="email"
            placeholder="Enter email"
            fullWidth
            value={email}
            onChange={emailChangeHandler}
            className="lower-margin"
            required

          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={password}
            onChange={passwordChangeHandler}
            className="lower-margin"
            required
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={confirmPasswordHandler}
            className="lower-margin"
            required
          />
          {!loading ? <Button className="button" variant="contained" onClick={register}>
            Register Now
          </Button> : <LinearProgress className="loading-center" />}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
