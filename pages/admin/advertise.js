import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
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
// import Cookies from 'js-cookie';
// import { updateCurrentAction } from '../../utils/common';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        advertises: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
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

function AdminAdvertise() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [
    { loading, error, advertises, loadingCreate, successDelete, loadingDelete },
    dispatch_local,
  ] = useReducer(reducer, {
    loading: true,
    advertises: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch_local({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/advertises`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch_local({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        if (getError(err) == 'Token is not valid') {
          clearCookies();
          await dispatch({
            type: 'USER_LOGOUT',
          });

          router.push('/login?redirect=/admin/advertise');
        } else dispatch_local({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch_local({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();
  const createHandler = async () => {
    if (!window.confirm('새로운 광고를 생성하겠습니까?')) {
      return;
    }
    try {
      dispatch_local({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/advertises`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch_local({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('광고가 창조되였습니다.', { variant: 'success' });
      router.push(`/admin/advertise/${data.advertise._id}`);
    } catch (err) {
      dispatch_local({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const deleteHandler = async (advertiseId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    try {
      dispatch_local({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/advertises/${advertiseId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch_local({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('삭제되였습니다.', { variant: 'success' });
    } catch (err) {
      dispatch_local({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="광고관리" isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'advertise'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      광고관리
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={6}>
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      새광고
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
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
                          <TableCell>No</TableCell>
                          <TableCell>KEY</TableCell>
                          <TableCell>광고명</TableCell>
                          <TableCell>광고링크</TableCell>
                          <TableCell>광고창조유저</TableCell>
                          <TableCell>광고적용상태</TableCell>
                          <TableCell>기타</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {advertises.map((advertise, index) => (
                          <TableRow key={advertise._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {advertise._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{advertise.advertiseName}</TableCell>
                            <TableCell>{advertise.linkUrl}</TableCell>
                            <TableCell>{advertise.user}</TableCell>
                            <TableCell>
                              {advertise.status == true ? '적용중' : '적용안됨'}
                            </TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/advertise/${advertise._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  변경
                                </Button>
                              </NextLink>{' '}
                              <Button
                                onClick={() => deleteHandler(advertise._id)}
                                size="small"
                                variant="contained"
                              >
                                삭제
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

export default dynamic(() => Promise.resolve(AdminAdvertise), { ssr: false });
