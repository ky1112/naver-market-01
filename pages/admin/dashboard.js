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
  CardContent,
  CardActions,
} from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { getError } from '../../utils/error';
import { clearCookies } from '../../utils/common';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import AdminSideBar from '../../components/AdminSidebar';
import useStyles from '../../utils/styles';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch_local] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: '',
  });

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/summary`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch_local({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push('/login?redirect=/admin/dashboard');
      } else {
        dispatch_local({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    fetchData();
  }, []);

  return (
    <Layout title="관리자 대시보드" isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'dashboard'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersPrice}원
                          </Typography>
                          <Typography>총판매금액</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              주문내역보기
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>총 주문건수</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/orders" passHref>
                            <Button size="small" color="primary">
                              주문내역보기
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>
                          <Typography>상품개수</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/products" passHref>
                            <Button size="small" color="primary">
                              상품보기
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>
                          <Typography>총 사용자수</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href="/admin/users" passHref>
                            <Button size="small" color="primary">
                              사용자보기
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component="h1" variant="h1">
                  판매실적차트
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: '판매',
                        backgroundColor: 'rgba(162, 222, 208, 1)',
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                      // {
                      //   label: '판매',
                      //   backgroundColor: 'rgba(162, 222, 208, 1)',
                      //   data: summary.salesData.map((x) => x.totalSales),
                      // },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                ></Bar>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
