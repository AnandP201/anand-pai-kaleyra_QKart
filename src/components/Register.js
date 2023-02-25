import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  })

  const [isReqProcessing, setIsReqProcessing] = useState(false)


  const emptyForm = () => {
    setData({ ...data, username: "", password: "", confirmPassword: "" })
  }


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

    return axios.post(`${config.endpoint}/auth/register`, formData).then((response) => {

      return { status: 201, message: 'Registered successfully' }

    }).catch((error) => {
      if (error.response === undefined) {
        return { message: 'Something went wrong. Check that the backend is running, reachable and returns valid JSON.' }
      }
      if (error.response.status === 400) {
        return { message: error.response.data.message }
      }
    })



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
    const uname = data.username
    const pass = data.password
    const checkPass = data.confirmPassword

    if (uname.length === 0) {
      enqueueSnackbar("Username is a required field", { variant: 'error' })
      return
    }
    else if (uname.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: 'error' })
      return
    }
    else if (pass.length === 0) {
      enqueueSnackbar("Password is a required field", { variant: 'error' })
      return
    }
    else if (pass.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: 'error' })
      return
    }

    else if (pass.localeCompare(checkPass) !== 0) {
      enqueueSnackbar("Passwords do not match", { variant: 'error' })
      return
    }
    setIsReqProcessing(true)

    const reqData = { username: data.username, password: data.password }

    register(reqData).then((response) => {
      setIsReqProcessing(false)
      if (response.status === 201) {
        enqueueSnackbar(response.message, { variant: 'success' })
        emptyForm()
      } else {
        enqueueSnackbar(response.message, { variant: 'error' })
      }
    })

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={data.username}
            title="Username"
            name="username"
            onChange={(ev) => {
              setData({ ...data, username: ev.target.value })
            }}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={(ev) => {
              setData({ ...data, password: ev.target.value })
            }}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={data.confirmPassword}
            type="password"
            onChange={(ev) => {
              setData({ ...data, confirmPassword: ev.target.value })
            }}
            fullWidth
          />
          {isReqProcessing && <div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress color={'success'} /></div>}
          {!isReqProcessing && <Button className="button" variant="contained" onClick={() => {
            validateInput(data)
          }}>
            Register Now
          </Button>}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="#">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
