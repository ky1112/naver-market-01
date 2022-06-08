/* eslint-disable @next/next/no-img-element */
import NextLink from 'next/link';
import { Grid, Link, Typography } from '@material-ui/core';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import Advertise from '../models/Advertise';

import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';

export default function Home(props) {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, advertises } = props;

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('미안하지만 상품재고량이 부족합니다.');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout>
      <Carousel className={classes.mt1} animation="slide">
        {advertises.map((advertise) => (
          <NextLink key={advertise._id} href={advertise.linkUrl} passHref>
            <Link>
              <img
                src={advertise.imagePath}
                alt={advertise.advertiseName}
                className={classes.featuredImage}
              ></img>
            </Link>
          </NextLink>
        ))}
      </Carousel>

      <Typography variant="h2">인기상품</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  // const featuredProductsDocs = await Product.find(
  //   { isFeatured: true },
  //   '-reviews'
  // )
  //   .lean()
  //   .limit(3);

  const advertiseDocs = await Advertise.find({}).lean();

  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  await db.disconnect();

  return {
    props: {
      advertises: advertiseDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj4Product),
    },
  };
}
