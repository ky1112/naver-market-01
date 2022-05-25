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
  TextField,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@material-ui/core';

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
      return {
        ...state,
        loading: false,
        error: '',
      };
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

function AdvertiseEdit({ params }) {
  const advertiseId = params.id;
  const { state, dispatch } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch_local] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

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
  const [advertiseStatus, SetAdvertiseStatus] = useState(false);

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/advertises/${advertiseId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      dispatch_local({ type: 'FETCH_SUCCESS' });

      setValue('advertiseName', data.advertiseName);
      setValue('linkUrl', data.linkUrl);
      setValue('imagePath', data.imagePath);
      setValue('advertiseStatus', data.status);
      SetAdvertiseStatus(data.status);
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push(`/login?redirect=/admin/advertise/${advertiseId}`);
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

  const uploadHandler = async (e, imageField = 'imagePath') => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch_local({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch_local({ type: 'UPLOAD_SUCCESS' });
      setValue(imageField, data.secure_url);
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (err) {
      dispatch_local({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const submitHandler = async ({ advertiseName, linkUrl, imagePath }) => {
    closeSnackbar();
    try {
      dispatch_local({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/advertises/${advertiseId}`,
        {
          advertiseName: advertiseName,
          linkUrl: linkUrl,
          imagePath: imagePath,
          advertiseStatus: advertiseStatus,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch_local({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('업데이트되였습니다.', { variant: 'success' });
      router.push('/admin/advertise');
    } catch (err) {
      dispatch_local({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    // <Layout title={`광고편집 ${advertiseId}`} isAdminPage="True">
    <Layout title={`광고편집`} isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'advertise'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  광고편집 {advertiseId}
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
                        name="advertiseName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="advertiseName"
                            label="광고이름"
                            error={Boolean(errors.advertiseName)}
                            helperText={
                              errors.name ? '광고이름을 입력하세요.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="linkUrl"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="linkUrl"
                            label="광고링크"
                            error={Boolean(errors.linkUrl)}
                            helperText={
                              errors.linkUrl ? '광고링크가 필요합니다.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="imagePath"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="imagePath"
                            label="광고이미지"
                            error={Boolean(errors.imagePath)}
                            helperText={
                              errors.imagePath ? '광고이미지를 입력하세요.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" component="label">
                        이미지파일 업로드
                        <input type="file" onChange={uploadHandler} hidden />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="광고적용상태"
                        control={
                          <Checkbox
                            onClick={(e) =>
                              SetAdvertiseStatus(e.target.checked)
                            }
                            id="advertiseStatus"
                            checked={advertiseStatus}
                            name="advertiseStatus"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        업데이트
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

export default dynamic(() => Promise.resolve(AdvertiseEdit), { ssr: false });
