import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import React, { useEffect, useContext, useReducer } from 'react';
import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/AdminSidebar';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import { clearCookies } from '../../utils/common';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function MonitorUser() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [
    { loading, error, users, successDelete, loadingDelete },
    dispatch_local,
  ] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
  });

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/monitor`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      //console.log({ data });
      dispatch_local({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push('/login?redirect=/admin/category');
      } else dispatch_local({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const timer = setInterval(() => {
      fetchData();
    }, 30000);

    if (successDelete) {
      dispatch_local({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
    return () => clearTimeout(timer);
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (userId) => {
    // if (!window.confirm('Are you sure?')) {
    //   return;
    // }

    try {
      dispatch_local({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/monitor/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch_local({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch_local({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title="?????????????????????" isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'monitoring'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  ?????????????????????
                </Typography>
                {loadingDelete && <CircularProgress />}
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>ID</TableCell> */}
                          <TableCell>No</TableCell>
                          <TableCell>UserID</TableCell>
                          <TableCell>IP</TableCell>
                          <TableCell>??????ID</TableCell>
                          <TableCell>?????????</TableCell>
                          <TableCell>??????</TableCell>
                          <TableCell>??????</TableCell>
                          <TableCell>??????</TableCell>
                          <TableCell>?????????</TableCell>
                          <TableCell>????????????</TableCell>
                          <TableCell>????????????</TableCell>
                          <TableCell>??????</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.user}</TableCell>
                            <TableCell>{user.ip}</TableCell>
                            <TableCell>???????????????</TableCell>
                            <TableCell>?????????</TableCell>
                            <TableCell>??????</TableCell>
                            <TableCell>??????</TableCell>
                            <TableCell>
                              {user.isMobile ? '?????????' : '????????????'}
                            </TableCell>
                            <TableCell>{user.token.substr(-5)}</TableCell>
                            <TableCell>
                              {(new Date().getTime() -
                                new Date(user.createdAt).getTime()) /
                                1000}
                              ???
                            </TableCell>
                            <TableCell>{user.isConnected}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => deleteHandler(user._id)}
                                size="small"
                                variant="contained"
                              >
                                ??????
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(MonitorUser), { ssr: false });
