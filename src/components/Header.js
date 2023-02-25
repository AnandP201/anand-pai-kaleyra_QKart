
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const history = useHistory()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [name, setName] = useState(null)


  useEffect(() => {

    const username = localStorage.getItem('username')

    if (username) {
      setIsLoggedIn(true)
      setName(username)
    }


  }, [])

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {isLoggedIn &&
        <Stack direction="row" spacing={2}>
          <Avatar alt={name} src="avatar.png" />
          <div style={{ display: 'flex', alignItems: 'center' }}>{name}</div>
          <Button className="button" variant="contained" onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}>LOGOUT</Button>
        </Stack>
      }
      {
        !isLoggedIn && hasHiddenAuthButtons && <Stack direction="row" spacing={2}>
          <Button
            className="button"
            onClick={() => {
              history.push("/login")
            }}
            variant="contained">
            LOGIN
          </Button>
          <Button
            className="button"
            onClick={() => {
              history.push("/register")
            }}
            variant="contained">
            REGISTER
          </Button>
        </Stack>
      }
      {
        !hasHiddenAuthButtons &&
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/")
          }}
        >
          Back to explore
        </Button>
      }
    </Box>
  );
};

export default Header;
