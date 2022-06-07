import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import Image from 'next/image';

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
        categories: action.payload.categories,
        tags: action.payload.tags,
        imageData: action.payload.images,
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
        imageData: action.payload,
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    case 'FETCH_TAGS_BY_CATEGORY_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_TAGS_BY_CATEGORY_SUCCESS':
      return { ...state, loading: false, error: '', tags: action.payload };
    case 'FETCH_TAGS_BY_CATEGORY_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function ProductEdit({ params }) {
  const productId = params.id;
  const { state, dispatch } = useContext(Store);
  const [
    {
      loading,
      error,
      loadingUpdate,
      loadingUpload,
      categories,
      tags,
      imageData,
    },
    dispatch_local,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    categories: [],
    tags: [],
    imageData: [],
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

  const fetchData = async () => {
    try {
      dispatch_local({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      const res = await axios.get(`/api/admin/categories/`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      const res_tag = await axios.get(
        `/api/admin/categories/get_tag_info_by_catname?name=${data.category}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      const ultres = {
        categories: res.data,
        tags: res_tag.data.tags,
        images: data.image,
      };

      dispatch_local({ type: 'FETCH_SUCCESS', payload: ultres });
      //categories.current = res.data;

      setValue('name', data.name);
      setValue('slug', data.slug);
      setValue('price', data.price);
      setValue('image', data.image);
      setValue('featuredImage', data.featuredImage);
      setIsFeatured(data.isFeatured);
      setValue('category', data.category);
      setValue('subcategory', data.tagName);
      setValue('brand', data.brand);
      setValue('countInStock', data.countInStock);
      setValue('description', data.description);
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });

        router.push(`/login?redirect=/admin/product/${productId}`);
      } else dispatch_local({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  const fetchTags = async (category_id) => {
    try {
      dispatch_local({ type: 'FETCH_TAGS_BY_CATEGORY_REQUEST' });
      const { data } = await axios.get(
        `/api/admin/categories/get_tag_info_by_catid?id=${category_id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log({ data });
      dispatch_local({
        type: 'FETCH_TAGS_BY_CATEGORY_SUCCESS',
        payload: data.tags,
      });
    } catch (err) {
      if (getError(err) == 'Token is not valid') {
        clearCookies();
        await dispatch({
          type: 'USER_LOGOUT',
        });
        router.push(`/login?redirect=/admin/product/${productId}`);
      } else
        dispatch_local({
          type: 'FETCH_TAGS_BY_CATEGORY_FAIL',
          payload: getError(err),
        });
    }
  };

  useEffect(() => {
    // console.log({
    //   handleSubmit,
    //   control,
    //   formState: { errors },
    //   setValue,
    // });
    if (!userInfo) {
      return router.push('/login');
    } else {
      fetchData();
    }
  }, []);

  const uploadHandler = async (e, imageField = 'image') => {
    const files = e.target.files;
    //console.log(files);
    let imageList = [];
    for (var i = 0; i < files.length; i++) {
      const bodyFormData = new FormData();
      bodyFormData.append('file', files[i]);
      try {
        dispatch_local({ type: 'UPLOAD_REQUEST' });
        const { data } = await axios.post('/api/admin/upload', bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        //dispatch_local({ type: 'UPLOAD_SUCCESS' });
        setValue(imageField, data.secure_url);
        imageList.push({ imagePath: data.secure_url });
        enqueueSnackbar('File uploaded successfully', { variant: 'success' });
      } catch (err) {
        dispatch_local({ type: 'UPLOAD_FAIL', payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    }
    dispatch_local({ type: 'UPLOAD_SUCCESS', payload: imageList });
    //console.log(imageList);
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    subcategory,
    image,
    featuredImage,
    brand,
    countInStock,
    description,
  }) => {
    closeSnackbar();
    try {
      dispatch_local({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          tagName: subcategory,
          image: imageData,
          isFeatured,
          featuredImage,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch_local({ type: 'UPDATE_SUCCESS' });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      router.push('/admin/products');
    } catch (err) {
      dispatch_local({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  const handleChangeCategory = async (category_id) => {
    console.log(category_id);
    await fetchTags(category_id);
  };

  const [isFeatured, setIsFeatured] = useState(false);

  return (
    <Layout title={`Edit Product ${productId}`} isAdminPage="True">
      <Grid container spacing={1}>
        <AdminSideBar activeSelect={'product'} />
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Edit Product {productId}
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
                            label="상품이름"
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name ? '상품이름이 필요합니다' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="상품식별자"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? 'Slug is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="상품가격"
                            error={Boolean(errors.price)}
                            helperText={errors.price ? '가격을 입력하세요' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    {/* <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="image"
                            label="Image"
                            error={Boolean(errors.image)}
                            helperText={errors.image ? 'Image is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem> */}

                    <ListItem>
                      <Carousel className={classes.mt1} animation="slide">
                        {imageData.map((ig) => (
                          // <img src={ig.imagePath} alt={1}></img>
                          <Image
                            key={ig._id}
                            src={ig.imagePath}
                            alt={''}
                            width={'400px'}
                            height={'400px'}
                          ></Image>
                        ))}
                      </Carousel>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" component="label">
                        상품이미지파일 업로드
                        <input
                          type="file"
                          onChange={uploadHandler}
                          hidden
                          multiple
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem>

                    <ListItem>
                      <FormControlLabel
                        label="특정상품인가요?"
                        control={
                          <Checkbox
                            onClick={(e) => setIsFeatured(e.target.checked)}
                            checked={isFeatured}
                            name="isFeatured"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    {/* <ListItem>
                      <Controller
                        name="featuredImage"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="featuredImage"
                            label="Featured Image"
                            error={Boolean(errors.image)}
                            helperText={
                              errors.image ? 'Featured Image is required' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Button variant="contained" component="label">
                        Upload File
                        <input
                          type="file"
                          onChange={(e) => uploadHandler(e, 'featuredImage')}
                          hidden
                        />
                      </Button>
                      {loadingUpload && <CircularProgress />}
                    </ListItem> */}

                    {/* <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? 'Category is required' : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem> */}

                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            id="category"
                            variant="outlined"
                            fullWidth
                            select
                            label="카테고리"
                            helperText={
                              errors.category ? 'Category is required' : ''
                            }
                            {...field}
                          >
                            {categories.map((option) => (
                              <MenuItem
                                key={option._id}
                                value={option.name}
                                onClick={() => handleChangeCategory(option._id)}
                              >
                                {option.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="subcategory"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: false,
                        }}
                        render={({ field }) => (
                          <TextField
                            id="subcategory"
                            variant="outlined"
                            fullWidth
                            select
                            label="서브카테고리"
                            helperText={
                              errors.subcategory
                                ? '서브카테고리를 선택하세요'
                                : ''
                            }
                            {...field}
                          >
                            {tags.map((option) => (
                              <MenuItem key={option._id} value={option.tagName}>
                                {option.tagName}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Brand"
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? 'Brand is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count in stock"
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? 'Count in stock is required'
                                : ''
                            }
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="description"
                            label="Description"
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? 'Description is required'
                                : ''
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

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
