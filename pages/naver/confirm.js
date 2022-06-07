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
import React, { useContext, useEffect, useState } from 'react';
import NaverLayout from '../../components/NaverLayout';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { updateCurrentAction } from '../../utils/common';
import Image from 'next/image';

export default function ConfirmPaymentDlg() {
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { naverUserInfo } = state;

  const {
    cart: { cartItems },
  } = state;

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    var t1 = 0;
    cartItems.map((item) => {
      t1 = t1 + item.price * item.quantity;
    });

    setTotalPrice(t1);
  }, []);

  const classes = useStyles();

  const submitHandler = async () => {
    try {
      if (!naverUserInfo) {
        router.push('/naver/login');
      } else router.push('/naver/naverpay');
    } catch (err) {
      console.log(err);
    }
  };

  const cancelHandler = async () => {
    try {
      router.back();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={classes.q1_wr}>
        <div className={classes.q1_jz}>
          <div className={classes.q1_nr}>
            <div className={classes.q1_nr_01}>구매하기</div>
            <div className={classes.q1_nr_02}>
              <div className={classes.q1_nr_0201}>
                선택하신{' '}
                {cartItems.map((item, index) =>
                  index + 1 == cartItems.length ? (
                    <span key={item._id}>
                      {item.name}&nbsp;{item.quantity}개&nbsp;
                    </span>
                  ) : (
                    <span key={item._id}>
                      {item.name}&nbsp;{item.quantity}개,&nbsp;
                    </span>
                  )
                )}
                {''}
                급처합니다[안전거래] ({cartItems.length}개) 구매하시겠습니까?
              </div>
              <div className={classes.q1_nr_0202}>
                구매가격 : <span style={{ color: 'red' }}>{totalPrice}원</span>
              </div>
            </div>
            <div className={classes.q1_nr_03}>
              <a href="#">
                <button
                  type="button"
                  className={classes.q1_btn_01}
                  onClick={submitHandler}
                >
                  예
                </button>
              </a>
              <a href="#">
                <button
                  type="button"
                  className={classes.q1_btn_02}
                  onClick={cancelHandler}
                >
                  아니요
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
