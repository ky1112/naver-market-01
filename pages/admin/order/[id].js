import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer } from 'react';
import NextLink from 'next/link';
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Button,
  Card,
  List,
  ListItem,
} from '@material-ui/core';
import Image from 'next/image';

//import ListItemAvatar from '@material-ui/core/ListItemAvatar';
//import Avatar from '@material-ui/core/Avatar';
//import ImageIcon from '@material-ui/icons/Image';

import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import AdminSideBar from '../../../components/AdminSidebar';
import useStyles from '../../../utils/styles';
//import { Controller, useForm } from 'react-hook-form';
//import { useSnackbar } from 'notistack';
//import { clearCookies } from '../../../utils/common';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      };
    default:
      state;
  }
}

function OrderDetail({ params }) {
  const orderId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, loadingDeliver }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
    }
  );
  const {
    orderNo,
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  //const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrder();
  }, []);

  return (
    <Layout title={`??????????????????`} isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'order'} />
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid item md={9} xs={12}>
              <Card className={classes.section}>
                <List>
                  <ListItem>
                    <Typography component="h1" variant="h1">
                      ????????????: {orderNo}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {loading && <CircularProgress></CircularProgress>}
                    {error && (
                      <Typography className={classes.error}>{error}</Typography>
                    )}
                  </ListItem>
                  <ListItem>
                    <Grid container spacing={1}>
                      <Grid item md={9} xs={12}>
                        <Card className={classes.section}>
                          <List>
                            <ListItem>
                              <Typography component="h2" variant="h2">
                                ???????????????
                              </Typography>
                            </ListItem>
                            <ListItem>
                              ?????????:<b>{shippingAddress.fullName}</b>,
                              {/* {shippingAddress.address}, {shippingAddress.city},{' '}
                              {shippingAddress.postalCode},{' '}
                              {shippingAddress.country}
                              &nbsp;
                              {shippingAddress.location && (
                                <Link
                                  variant="button"
                                  target="_new"
                                  href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                                >
                                  Show On Map
                                </Link>
                              )} */}
                            </ListItem>
                            <ListItem>
                              ????????? ????????????1:&nbsp;
                              <b>{shippingAddress.contactNo1}</b>
                            </ListItem>
                            <ListItem>
                              ????????? ????????????2:&nbsp;
                              <b>{shippingAddress.contactNo2}</b>
                            </ListItem>
                            <ListItem>
                              ???????????????:&nbsp;<b>{shippingAddress.address}</b>
                            </ListItem>
                            <ListItem>
                              ????????????:&nbsp;{' '}
                              {isDelivered ? (
                                `delivered at ${deliveredAt}`
                              ) : (
                                <b>??????</b>
                              )}
                            </ListItem>
                          </List>
                        </Card>
                        <Card className={classes.section}>
                          <List>
                            <ListItem>
                              <Typography component="h2" variant="h2">
                                ????????????
                              </Typography>
                            </ListItem>
                            <ListItem>{paymentMethod}</ListItem>
                            <ListItem>
                              ????????????:&nbsp;{' '}
                              {isPaid ? `paid at ${paidAt}` : '????????????'}
                            </ListItem>
                          </List>
                        </Card>
                        <Card className={classes.section}>
                          <List>
                            <ListItem>
                              <Typography component="h2" variant="h2">
                                ????????????
                              </Typography>
                            </ListItem>
                            <ListItem>
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>???????????????</TableCell>
                                      <TableCell>??????</TableCell>
                                      <TableCell align="right">??????</TableCell>
                                      <TableCell align="right">??????</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {orderItems.map((item) => (
                                      <TableRow key={item._id}>
                                        <TableCell>
                                          <NextLink
                                            href={`/product/${item.slug}`}
                                            passHref
                                          >
                                            <Link>
                                              <Image
                                                src={
                                                  JSON.parse(item.image)[0]
                                                    .imagePath
                                                }
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                              ></Image>
                                            </Link>
                                          </NextLink>
                                        </TableCell>

                                        <TableCell>
                                          <NextLink
                                            href={`/product/${item.slug}`}
                                            passHref
                                          >
                                            <Link>
                                              <Typography>
                                                {item.name}
                                              </Typography>
                                            </Link>
                                          </NextLink>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography>
                                            {item.quantity}
                                          </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                          <Typography>
                                            {item.price}???
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </ListItem>
                          </List>
                        </Card>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Card className={classes.section}>
                          <List>
                            <ListItem>
                              <Typography variant="h2">??????</Typography>
                            </ListItem>
                            <ListItem>
                              <Grid container>
                                <Grid item xs={6}>
                                  <Typography>???????????????:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography align="right">
                                    {itemsPrice}???
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                            <ListItem>
                              <Grid container>
                                <Grid item xs={6}>
                                  <Typography>?????????:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography align="right">
                                    {taxPrice}???
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                            <ListItem>
                              <Grid container>
                                <Grid item xs={6}>
                                  <Typography>?????????:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography align="right">
                                    {shippingPrice}???
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                            <ListItem>
                              <Grid container>
                                <Grid item xs={6}>
                                  <Typography>
                                    <strong>??????:</strong>
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography align="right">
                                    <strong>{totalPrice}???</strong>
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                            {userInfo.isAdmin &&
                              order.isPaid &&
                              !order.isDelivered && (
                                <ListItem>
                                  {loadingDeliver && <CircularProgress />}
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => console.log(1)}
                                  >
                                    Deliver Order
                                  </Button>
                                </ListItem>
                              )}
                          </List>
                        </Card>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(OrderDetail), { ssr: false });
