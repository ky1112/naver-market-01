import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import NextLink from 'next/link';
import Rating from '@material-ui/lab/Rating';

export default function ProductItem({ product, addToCartHandler }) {
  useEffect(() => {
    //console.log(1);
    // var a = JSON.parse(product.image);
    // console.log(a[0].imagePath);
  });

  return (
    <Card>
      <NextLink href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={JSON.parse(product.image)[0].imagePath}
            title={product.name}
            width={'400px'}
            height={'500px'}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>{product.price}원</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          카트에 추가
        </Button>
      </CardActions>
    </Card>
  );
}
