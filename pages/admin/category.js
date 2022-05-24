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
        categories: action.payload,
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

function AdminCategories() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [
    { loading, error, categories, loadingCreate, successDelete, loadingDelete },
    dispatch_local,
  ] = useReducer(reducer, {
    loading: true,
    categories: [],
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch_local({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/categories`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
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
    if (successDelete) {
      dispatch_local({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();
  const createHandler = async () => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch_local({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/admin/categories`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch_local({ type: 'CREATE_SUCCESS' });
      enqueueSnackbar('Category created successfully', { variant: 'success' });
      router.push(`/admin/category/${data.category._id}`);
    } catch (err) {
      dispatch_local({ type: 'CREATE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const deleteHandler = async (categoryId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch_local({ type: 'DELETE_REQUEST' });
      await axios.delete(`/api/admin/categories/${categoryId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch_local({ type: 'DELETE_SUCCESS' });
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
    } catch (err) {
      dispatch_local({ type: 'DELETE_FAIL' });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title="카테고리" isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'category'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      카테고리
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={6}>
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      새카테고리
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
                          <TableCell>카테고리명</TableCell>
                          <TableCell>슬러그</TableCell>
                          <TableCell>태그(서브카테고리)</TableCell>
                          <TableCell>유저</TableCell>
                          <TableCell>기타</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((category, index) => (
                          <TableRow key={category._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {category._id.substring(20, 24)}
                            </TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.slug}</TableCell>
                            <TableCell>
                              {category.tags.map((tag) => (
                                <span key={tag._id} className={classes.spands}>
                                  {tag.tagName}
                                </span>
                              ))}
                            </TableCell>
                            <TableCell>{category.user}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/category/${category._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  변경
                                </Button>
                              </NextLink>{' '}
                              <Button
                                onClick={() => deleteHandler(category._id)}
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

export default dynamic(() => Promise.resolve(AdminCategories), { ssr: false });
