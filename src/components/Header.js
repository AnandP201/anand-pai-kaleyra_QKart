import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Search from '@mui/icons-material/Search';
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box"
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
            {
                children && <Box className="search-desktop">
                    <OutlinedInput
                        id="outlined-adornment-search"
                        className="search"
                        onChange={(ev) => {
                            children.callApi(ev, 500)
                        }}
                        placeholder="Search for items/categories"
                        size="small"
                        endAdornment={
                            <InputAdornment position="end">
                                <Search style={{ color: "#00a278" }} />
                            </InputAdornment>
                        }
                    />
                </Box>
            }
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
