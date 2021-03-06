import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';

import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
  //FormControlLabel,
  //Checkbox,
  //MenuItem,
} from '@material-ui/core';

import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/AdminSidebar';
import useStyles from '../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { clearCookies } from '../../utils/common';

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

function BankInfo() {
  //const advertiseId = params.id;
  const { state, dispatch } = useContext(Store);
  const [{ loading, error, loadingUpdate /*loadingUpload*/ }, dispatch_local] =
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
  //const [advertiseStatus, SetAdvertiseStatus] = useState(false);

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/bankinfo`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      dispatch_local({ type: 'FETCH_SUCCESS' });

      setValue('salerName', data.salerName);
      setValue('salerEmail', data.salerEmail);
      setValue('bankName', data.bankName);
      setValue('bankDescription', data.bankDescription);
      setValue('ownerName', data.ownerName);
      setValue('payValidDate', data.payValidDate);
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push(`/login?redirect=/admin/bankinfo`);
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

  const submitHandler = async ({
    salerName,
    salerEmail,
    bankName,
    bankDescription,
    ownerName,
    payValidDate,
  }) => {
    closeSnackbar();
    try {
      dispatch_local({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/bankinfo`,
        {
          salerName: salerName,
          salerEmail: salerEmail,
          bankName: bankName,
          bankDescription: bankDescription,
          ownerName: ownerName,
          payValidDate: payValidDate,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch_local({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('???????????????????????????.', { variant: 'success' });
      router.push('/admin/bankinfo');
    } catch (err) {
      dispatch_local({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  //return <div></div>;

  return (
    // <Layout title={`???????????? ${advertiseId}`} isAdminPage="True">
    <Layout title={`??????????????????`} isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'bankinfo'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  ??????????????????
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
                        name="salerName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="salerName"
                            label="???????????????"
                            error={Boolean(errors.salerName)}
                            helperText={
                              errors.name ? '?????????????????? ???????????????.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="salerEmail"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="salerEmail"
                            label="????????????????????????"
                            error={Boolean(errors.salerEmail)}
                            helperText={
                              errors.name
                                ? '??????????????????????????? ???????????????.'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="bankName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="bankName"
                            label="????????????"
                            error={Boolean(errors.bankName)}
                            helperText={
                              errors.name ? '??????????????? ???????????????.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="bankDescription"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="bankDescription"
                            label="??????????????????"
                            error={Boolean(errors.bankDescription)}
                            helperText={
                              errors.name ? '????????????????????? ???????????????.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="ownerName"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="ownerName"
                            label="?????????"
                            error={Boolean(errors.ownerName)}
                            helperText={
                              errors.name ? '???????????? ???????????????.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="payValidDate"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="payValidDate"
                            label="????????????"
                            error={Boolean(errors.payValidDate)}
                            helperText={
                              errors.name ? '??????????????? ???????????????.' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
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

// export async function getServerSideProps({ params }) {
//   return {
//     props: { params },
//   };
// }

export default dynamic(() => Promise.resolve(BankInfo), { ssr: false });
