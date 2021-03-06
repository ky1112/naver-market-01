import React, { useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { createTheme } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  //createMuiTheme,
  ThemeProvider,
  CssBaseline,
  // Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  // Drawer,
  // List,
  // ListItem,
  // Divider,
  // ListItemText,
  InputBase,
} from '@material-ui/core';
//import MenuIcon from '@material-ui/icons/Menu';
//import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { updateCurrentAction } from '../utils/common';
import Category from './Category';

export default function Layout({ title, description, children, isAdminPage }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const classes = useStyles();

  // const [sidbarVisible, setSidebarVisible] = useState(false);
  // const sidebarOpenHandler = () => {
  //   setSidebarVisible(true);
  // };

  // const sidebarCloseHandler = () => {
  //   setSidebarVisible(false);
  // };

  // const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchCategories = async () => {
    try {
      await axios.get(`/api/categories/categories`);
      //setCategories(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const [query, setQuery] = useState('');

  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  */

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    // test app
    setAnchorEl(null);
    if (redirect && redirect != 'backdropClick') {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });

    updateCurrentAction({
      token: userInfo.token,
      useremail: userInfo.email,
      accessUrl: 'logged out',
      isConnected: false,
    });

    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippinhAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - ????????? ????????????` : '????????? ????????????'}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              {/* <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                className={classes.menuButton}
              >
                <MenuIcon className={classes.navbarButton} />
              </IconButton> */}

              <NextLink href="/" passHref>
                <Link>
                  <Typography className={classes.brand}>
                    ????????? ????????????
                  </Typography>
                </Link>
              </NextLink>
            </Box>
            {/* <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>Shopping by category</Typography>
                    <IconButton
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink
                    key={category._id}
                    href={`/search?category=${category.name}`}
                    passHref
                  >
                    <ListItem
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category.name}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer> */}

            <div className={classes.searchSection}>
              <form onSubmit={submitHandler} className={classes.searchForm}>
                <InputBase
                  name="query"
                  className={classes.searchInput}
                  placeholder="???????????? ???????????????"
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </form>
            </div>
            <div>
              {/* <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch> */}
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        ????????????
                      </Badge>
                    ) : (
                      '????????????'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      ?????????
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      ????????????
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        ???????????????
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>????????????</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                    <Typography component="span">????????? ?????????</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <AppBar position="static" className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <div>
                <Grid container direction="column" alignItems="center">
                  <Grid item xs={12}>
                    <Category />
                  </Grid>
                </Grid>
              </div>
            </Box>
          </Toolbar>
        </AppBar>

        {(isAdminPage && (
          <Container className={classes.main} maxWidth={'1980px'}>
            {children}
          </Container>
        )) || <Container className={classes.main}>{children}</Container>}
        <footer className={classes.footer}>
          <Typography>All rights reserved. ????????? ????????????.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
