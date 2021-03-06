import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
} from '@material-ui/core';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import AdminSideBar from '../../../components/AdminSidebar';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { clearCookies } from '../../../utils/common';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '', tags: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function CategoryEdit({ params }) {
  const categoryId = params.id;
  const { state, dispatch } = useContext(Store);
  const [{ loading, error, loadingUpdate, tags }, dispatch_local] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      tags: [],
    }
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/categories/${categoryId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch_local({ type: 'FETCH_SUCCESS', payload: data.tags });
      setValue('name', data.name);
      // setValue('slug', data.slug);
      //console.log(data.tags);
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push(`/login?redirect=/admin/category/${categoryId}`);
      } else dispatch_local({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    } else {
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar();
    try {
      dispatch_local({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/categories/${categoryId}`,
        {
          name,
          username: userInfo.name,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch_local({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Category updated successfully', { variant: 'success' });
      router.push('/admin/category');
    } catch (err) {
      dispatch_local({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const [newTagValue, setNewTagValue] = useState('');
  const addTagHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `/api/categories/${categoryId}/addtag`,
        {
          tagName: newTagValue,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      enqueueSnackbar('Tag added successfully', { variant: 'success' });
      //fetchTags();
      setNewTagValue('');
      fetchData();
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const removeTagHandler = async (tagid) => {
    //e.preventDefault();

    try {
      await axios.post(
        `/api/categories/${categoryId}/removetag`,
        {
          tagId: tagid,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      enqueueSnackbar('Tag removed successfully', { variant: 'success' });
      //fetchTags();
      fetchData();
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title={`?????????????????? ${categoryId}`} isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'category'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  ?????????????????????: {categoryId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="???????????????"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? 'Name is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    {/* <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field: { value } }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="?????????"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Slug is required' : ''}
                            value={value}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem> */}

                    <ListItem>
                      <List style={{ width: '100%', maxWidth: '360px' }}>
                        {tags.map((tagItem) => (
                          <ListItem key={tagItem._id}>
                            <ListItemAvatar>
                              <Avatar>
                                <ImageIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={tagItem.tagName} />
                            <Button
                              variant="outlined"
                              component="label"
                              color="secondary"
                              style={{ marginLeft: '10px' }}
                              onClick={() => {
                                removeTagHandler(tagItem._id);
                              }}
                            >
                              ??????
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    </ListItem>

                    <ListItem>
                      <TextField
                        variant="outlined"
                        id="addtag"
                        label="??????????????? ???????????????"
                        helperText={
                          errors.addtag ? '??????????????? ???????????????' : ''
                        }
                        onChange={(e) => {
                          setNewTagValue(e.target.value);
                        }}
                        value={newTagValue}
                      ></TextField>
                      <Button
                        variant="outlined"
                        component="label"
                        color="secondary"
                        style={{ marginLeft: '10px' }}
                        onClick={addTagHandler}
                      >
                        ????????????
                      </Button>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        ????????????
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(CategoryEdit), { ssr: false });
