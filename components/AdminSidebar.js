import { Grid, Card, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';
import useStyles from '../utils/styles';

export default function AdminSideBar({ activeSelect }) {
  const classes = useStyles();
  return (
    <Grid item md={1} xs={12}>
      <Card className={classes.section}>
        <List>
          <NextLink href="/admin/dashboard" passHref>
            {activeSelect == 'dashboard' ? (
              <ListItem selected button component="a">
                <ListItemText primary="대시보드"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="대시보드"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/category" passHref>
            {activeSelect == 'category' ? (
              <ListItem selected button component="a">
                <ListItemText primary="카테고리관리"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="카테고리관리"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/orders" passHref>
            {activeSelect == 'order' ? (
              <ListItem selected button component="a">
                <ListItemText primary="주문내역관리"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="주문내역관리"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/products" passHref>
            {activeSelect == 'product' ? (
              <ListItem selected button component="a">
                <ListItemText primary="상품관리"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="상품관리"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/advertise" passHref>
            {activeSelect == 'advertise' ? (
              <ListItem selected button component="a">
                <ListItemText primary="광고관리"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="광고관리"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/monitor" passHref>
            {activeSelect == 'monitoring' ? (
              <ListItem selected button component="a">
                <ListItemText primary="실시간모니터링"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="실시간모니터링"></ListItemText>
              </ListItem>
            )}
          </NextLink>

          <NextLink href="/admin/users" passHref>
            {activeSelect == 'user' ? (
              <ListItem selected button component="a">
                <ListItemText primary="회원관리"></ListItemText>
              </ListItem>
            ) : (
              <ListItem button component="a">
                <ListItemText primary="회원관리"></ListItemText>
              </ListItem>
            )}
          </NextLink>
        </List>
      </Card>
    </Grid>
  );
}
