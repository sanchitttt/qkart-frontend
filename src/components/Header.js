import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, TextField, InputAdornment } from "@mui/material";
import { useHistory, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import SearchIcon from '@mui/icons-material/Search';



const Header = ({ children, hasHiddenAuthButtons, searchBarImplementations }) => {
  let isLoggedIn;
  let history = useHistory();

  if (localStorage.getItem("username") !== null) {
    isLoggedIn = true;
  }
  else {
    isLoggedIn = false;
  }
  const handleLogoutHandler = () => {
    localStorage.clear();
    history.push("/login");
  }
  const handleRegisterHandler = () => {
    history.push("/")
  }
  const loginHandler = () => {
    history.push("/login");
  }
  const registerHandler = () => {
    history.push("/register");
  }



  return (
    <>
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {hasHiddenAuthButtons === "login" ? <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"

        >
          <Link to="/" className="link">Back to explore</Link>
        </Button>
          : hasHiddenAuthButtons === "register" ? <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={handleRegisterHandler}
          >
            Back to explore
          </Button>
            : hasHiddenAuthButtons === "products" && isLoggedIn === false ?
              <>
                <Box className="search-desktop-container">
                  <TextField fullWidth className="search-desktop" placeholder="Search for items/categories"
                    value={searchBarImplementations.searchBar1} onChange={searchBarImplementations.searchBar1Handler}
                    InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon color="primary" /></InputAdornment>, }} />
                </Box>
                <Box className="sideOptions">
                  <Button variant="text" onClick={loginHandler}>Login</Button>
                  <Button variant="contained" onClick={registerHandler}>Register Now</Button>
                </Box>
              </>
              : hasHiddenAuthButtons === "products" && isLoggedIn === true ?
                <>
                  <Box className="search-desktop-container">
                    <TextField fullWidth className="search-desktop" placeholder="Search for items/categories"
                      value={searchBarImplementations.searchBar1} onChange={searchBarImplementations.searchBar1Handler}
                      InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon color="primary" /></InputAdornment>, }} />
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar alt={localStorage.getItem("username")} src="../../public/avatar.png" />
                    <h6>{localStorage.getItem("username")}</h6>
                    <Button variant="text" onClick={handleLogoutHandler}>LOGOUT</Button>
                  </Stack>
                </>
                : <></>}
      </Box>
      {hasHiddenAuthButtons === "products" &&
        <Box>
          <TextField value={searchBarImplementations.searchBar2} onChange={searchBarImplementations.searchBar2Handler} margin="none" fullWidth className="search-mobile" placeholder="Search for items/categories" InputProps={{ endAdornment: <InputAdornment position="end"><SearchIcon color="primary" /></InputAdornment> }} />
        </Box>}
    </>
  );
};

export default Header;
