import {
  CircularProgress,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import useStyles from '../utils/styles';
import ProductItem from '../components/ProductItem';
import { Store } from '../utils/Store';
import axios from 'axios';
import Rating from '@material-ui/lab/Rating';
import { Pagination } from '@material-ui/lab';

import { withStyles } from '@material-ui/core/styles';
import CategoryBody from '../components/CategoryBody';

const PAGE_SIZE = 3;

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default function Search(props) {
  const classes = useStyles();
  const router = useRouter();
  const {
    query = 'all',
    category = 'all',
    //brand = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;
  const { products, countProducts, categories, /*brands,*/ pages } = props;
  const [tags, setTags] = useState([{ id: '제한없음', tagName: '제한없음' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [tagName, setTagName] = useState('제한없음');

  const filterSearch = ({
    page,
    category,
    //brand,
    tagName,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    //if (brand) query.brand = brand;
    if (tagName) query.tagName = tagName;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = async (e) => {
    setTagName('all');
    setIsLoading(true);
    if (e.target.value == 'all') {
      setTags([{ id: '제한없음', tagName: '제한없음' }]);
      setIsLoading(false);
    } else {
      const { data } = await axios.get(
        `/api/categories/get_tags_by_category?name=${e.target.value}`
      );
      setTags(data[0].tags);
      setIsLoading(false);
    }
    filterSearch({ category: e.target.value, tagName: 'all' });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const tagHandler = (e) => {
    setTagName(e.target.value);
    filterSearch({ tagName: e.target.value });
  };
  /*
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  */
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const fetchTags = async () => {
    try {
      if (category == 'all') {
        setIsLoading(false);
        setTags([{ id: '제한없음', tagName: '제한없음' }]);
      } else {
        const { data } = await axios.get(
          `/api/categories/get_tags_by_category?name=${category}`
        );
        setTags(data[0].tags);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title="Search">
      <Grid className={classes.mt1} container spacing={1}>
        <Grid item md={3}>
          <List>
            {/* <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>카테고리</Typography>
                <CategoryBody
                  handleClickCategorySearch={handleClickCategorySearch}
                />
              </Box>
            </ListItem> */}

            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>카테고리</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">제한없음</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            {isLoading === false ? (
              <ListItem>
                <Box className={classes.fullWidth}>
                  <Typography>하위카테고리</Typography>
                  <Select value={tagName} onChange={tagHandler} fullWidth>
                    <MenuItem value="all">제한없음</MenuItem>
                    {tags &&
                      tags.map((tag) => (
                        <MenuItem key={tag._id} value={tag.tagName}>
                          {tag.tagName}
                        </MenuItem>
                      ))}
                  </Select>
                </Box>
              </ListItem>
            ) : (
              <CircularProgress />
            )}

            {/* <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>상표</Typography>
                <Select value={brand} onChange={brandHandler} fullWidth>
                  <MenuItem value="all">제한없음</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem> */}
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>가격</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">제한없음</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>추천수</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">제한없음</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? 'No' : countProducts} 개의 검색결과
              {query !== 'all' && query !== '' && ' : ' + query}
              {category !== 'all' && ' : ' + category}
              {/* {brand !== 'all' && ' : ' + brand} */}
              {tag !== 'all' && ' : ' + tag}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              //brand !== 'all' ||
              tag !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography component="span" className={classes.sort}>
                정렬기준
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="featured">추천</MenuItem>
                <MenuItem value="lowest">낮은가격순</MenuItem>
                <MenuItem value="highest">높은가격순</MenuItem>
                <MenuItem value="toprated">리뷰</MenuItem>
                <MenuItem value="newest">새상품</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid className={classes.mt1} container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} key={product.name}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </Grid>
            ))}
          </Grid>
          <Pagination
            className={classes.mt1}
            defaultPage={parseInt(query.page || '1')}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const tagName = query.tagName || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const tagFilter = tagName && tagName !== 'all' ? { tagName } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  // 10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  //const brands = await Product.find().distinct('brand');

  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...tagFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...tagFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj4Product);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      //brands,
    },
  };
}
