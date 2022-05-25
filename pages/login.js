import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { updateCurrentAction } from '../utils/common';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const classes = useStyles();

  const submitHandler = async ({ userid, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        userid,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);

      await updateCurrentAction({
        token: data.token,
        userid: data.userid,
        //useremail: data.email,
        accessUrl: 'login',
        isConnected: true,
      });

      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          로그인
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="userid"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                //pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                pattern: '',
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="userid"
                  label="아이디"
                  inputProps={{ type: 'userid' }}
                  error={Boolean(errors.userid)}
                  helperText={
                    errors.userid
                      ? errors.userid.type === 'pattern'
                        ? '아이디가 유효하지 않습니다.'
                        : '아이디를 입력하세요'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="비밀번호"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? '비번은 5자리이상이여야 합니다.'
                        : '비번을 입력하세요'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              로그인
            </Button>
          </ListItem>
          <ListItem>
            아직 가입하지 않으셨다면 &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>회원가입</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
