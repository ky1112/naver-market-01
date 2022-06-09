import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Cookies from 'js-cookie';
import Image from 'next/image';

const phone_prefix = [
  '010',
  '011',
  '016',
  '017',
  '018',
  '019',
  '02',
  '031',
  '032',
  '033',
  '041',
  '042',
  '043',
  '044',
  '051',
  '052',
  '053',
  '054',
  '055',
  '061',
  '062',
  '063',
  '064',
  '070',
  '080',
  '0130',
  '0303',
  '0502',
  '0503',
  '0504',
  '0505',
  '0506',
  '0507',
  '050',
  '012',
  '059',
];

export default function Login() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { naverUserInfo } = state;
  const {
    cart: { cartItems },
  } = state;

  const [totalPrice, SetTotalPrice] = useState(0);
  const [receiverName, SetReceiverName] = useState('');
  const [contactNo1_1, SetContactNo1_1] = useState('010');
  const [contactNo1_2, SetContactNo1_2] = useState('');
  const [contactNo1_3, SetContactNo1_3] = useState('');

  const [contactNo2_1, SetContactNo2_1] = useState('010');
  const [contactNo2_2, SetContactNo2_2] = useState('');
  const [contactNo2_3, SetContactNo2_3] = useState('');

  const [receiverAddress, SetReceiverAddress] = useState('');
  const [receiverMemo, SetReceiverMemo] = useState('');
  const [billNo, SetBillNo] = useState('');
  const [billPhoneNo, SetBillPhoneNo] = useState('');

  const [loading, SetLoading] = useState(true);
  const [bankData, SetBankData] = useState({
    salerName: '',
    salerEmail: '',
    bankName: '',
    bankDescription: '',
    ownerName: '',
    payValidDate: '',
  });

  const deliverReceiverName = useRef(null);
  const r_contactNo1_2 = useRef(null);
  const r_contactNo1_3 = useRef(null);
  const r_contactNo2_2 = useRef(null);
  const r_contactNo2_3 = useRef(null);
  const r_receiverAddress = useRef(null);
  const r_receiverMemo = useRef(null);

  const handleChangeContactNo1_1 = (e) => {
    //console.log(e.target.value);
    SetContactNo1_1(e.target.value);
  };

  const handleChangeContactNo1_2 = (e) => {
    //console.log(e.target.value);
    SetContactNo1_2(e.target.value);
  };

  const handleChangeContactNo1_3 = (e) => {
    //console.log(e.target.value);
    SetContactNo1_3(e.target.value);
  };

  const handleChangeContactNo2_1 = (e) => {
    //console.log(e.target.value);
    SetContactNo2_1(e.target.value);
  };

  const handleChangeContactNo2_2 = (e) => {
    //console.log(e.target.value);
    SetContactNo2_2(e.target.value);
  };

  const handleChangeContactNo2_3 = (e) => {
    //console.log(e.target.value);
    SetContactNo2_3(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/bankinfo`, {});
      await SetBankData({
        salerName: '',
        salerEmail: data.salerEmail,
        bankName: data.bankName,
        bankDescription: data.bankDescription,
        ownerName: data.ownerName,
        payValidDate: data.payValidDate,
      });

      var sum = 0;
      cartItems.map((item) => {
        sum = sum + item.price * item.quantity;
      });
      SetTotalPrice(sum);
      SetLoading(false);
    };

    fetchData();
  }, []);

  const classes = useStyles();

  const submitForm = async (e) => {
    e.preventDefault();

    const year = new Date().getFullYear();
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2);
    const day = ('0' + new Date().getDate()).slice(-2);
    const hour = ('0' + new Date().getHours()).slice(-2);
    const minute = ('0' + new Date().getMinutes()).slice(-2);
    const second = ('0' + new Date().getSeconds()).slice(-2);
    const orderNo = year + month + day + hour + minute + second;

    if (!receiverName) {
      deliverReceiverName.current.focus();
      return;
    }

    if (!contactNo1_2) {
      r_contactNo1_2.current.focus();
      return;
    }

    if (!contactNo1_3) {
      r_contactNo1_3.current.focus();
      return;
    }

    if (!contactNo2_2) {
      r_contactNo2_2.current.focus();
      return;
    }

    if (!contactNo2_3) {
      r_contactNo2_3.current.focus();
      return;
    }

    if (!receiverAddress) {
      r_receiverAddress.current.focus();
      return;
    }

    if (!receiverMemo) {
      r_receiverMemo.current.focus();
      return;
    }

    const deliverInfo = {
      fullName: receiverName,
      orderNo: orderNo,
      contactNo1: contactNo1_1 + '-' + contactNo1_2 + '-' + contactNo1_3,
      contactNo2: contactNo2_1 + '-' + contactNo2_2 + '-' + contactNo2_3,
      address: receiverAddress,
      receiverMemo: receiverMemo,
      billNo: billNo,
      billPhoneNo: billPhoneNo,
      totalPrice: totalPrice,
    };

    try {
      await axios.post('/api/orders', {
        user: naverUserInfo.naverUserID,
        orderItems: cartItems,
        orderNo: orderNo,
        shippingAddress: deliverInfo,
        paymentMethod: '무통장입금',
        itemsPrice: totalPrice,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: totalPrice,
        billNo: billNo,
        billPhoneNo: billPhoneNo,
      });

      dispatch({ type: 'NAVER_DELIVER_INFO_CONFIRM', payload: deliverInfo });
      Cookies.set('naverDeliverInfo', deliverInfo);
      router.push('/naver/naverpaydone');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <form id="form1" name="form1" className={classes.naverpayform}>
          <div className={classes.h1_01_wr}>
            <div className={classes.h1_01_jz}>
              <div className={classes.h1_01_nr}>
                <div className={classes.h1_01_nr_01}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td width="400px">
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td width="60" className={classes.td_img}>
                                  <a href="https://www.naver.com/">
                                    <Image
                                      src={'/naver/h1_002.png'}
                                      alt={''}
                                      width={'48px'}
                                      height={'30px'}
                                    ></Image>
                                  </a>
                                </td>
                                <td className={classes.td_img}>
                                  <a href="https://shopping.naver.com/">
                                    <Image
                                      src={'/naver/h1_003.png'}
                                      alt={''}
                                      width={'71px'}
                                      height={'30px'}
                                    ></Image>
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td align="right">
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td align="right">
                                  <a
                                    href="#"
                                    style={{ fontSize: '12px', color: '#fff' }}
                                    onClick={() => router.push('/cart')}
                                  >
                                    장바구니
                                  </a>
                                </td>
                                <td
                                  align="right"
                                  width="40"
                                  className={classes.td_img}
                                >
                                  <a href="javascript:;">
                                    <Image
                                      src={'/naver/h1_004.png'}
                                      alt={''}
                                      width={'30px'}
                                      height={'30px'}
                                    ></Image>
                                  </a>
                                </td>
                                <td
                                  align="right"
                                  width="25"
                                  className={classes.td_img}
                                >
                                  <a href="javascript:;">
                                    <Image
                                      src={'/naver/h1_005.png'}
                                      alt={''}
                                      layout={'fill'}
                                      objectFit={'contain'}
                                    ></Image>
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={classes.h1_01_nr_02}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td
                          width="200"
                          className={classes.td_img}
                          style={{ position: 'relative' }}
                        >
                          <a href="https://pay.naver.com/">
                            <Image
                              src={'/naver/h1_006.png'}
                              alt={''}
                              width={'91px'}
                              height={'46px'}
                            ></Image>
                          </a>
                        </td>
                        <td align="right">
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td align="right">
                                  <a
                                    href="https://order.pay.naver.com/home"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    결제내역
                                  </a>
                                  <a
                                    href="https://order.pay.naver.com/home?tabMenu=POINT_TOTAL"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    포인트
                                  </a>
                                  <a
                                    href="https://pay.naver.com/send/p/list/s"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    송금
                                  </a>
                                  <a
                                    href="https://pay.naver.com/mygift/s"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    선물함
                                  </a>
                                  <a
                                    href="https://event2.pay.naver.com/event/benefit/list"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    이벤트·쿠폰
                                  </a>
                                  <a
                                    href="https://order.pay.naver.com/purchaseReview/orders"
                                    style={{
                                      fontSize: '16px',
                                      marginLeft: '40px',
                                      fontFamily: '&#39;Nanum Gothic&#39;',
                                      fontWeight: '700',
                                      color: '#fff',
                                    }}
                                  >
                                    문의·리뷰
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.h1_02_wr}>
            <div className={classes.h1_02_jz}>
              <div className={classes.h1_02_nr}>
                <div style={{ height: '40px' }}></div>
                <table width="100%">
                  <tbody>
                    <tr>
                      <td valign="top" style={{ position: 'relative' }}>
                        <div>
                          <Image
                            src={'/naver/h1_007.png'}
                            alt={''}
                            width={'1100px'}
                            height={'41px'}
                          ></Image>
                        </div>

                        <div
                          style={{
                            height: '61px',
                            backgroundImage: 'url(' + '/naver/h1_008.png' + ')',
                            backgroundRepeat: 'no-repeat',
                            fontSize: '13px',
                          }}
                        >
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td align="center" width="50" height="61">
                                  &nbsp;
                                </td>
                                <td align="center">상품정보</td>
                                <td align="center" width="120">
                                  판매자
                                </td>
                                <td align="center" width="120">
                                  배송비
                                </td>
                                <td align="center" width="100">
                                  수량
                                </td>
                                <td align="center" width="100">
                                  할인
                                </td>
                                <td align="center" width="150">
                                  주문금액
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          style={{
                            backgroundImage: 'url(' + '/naver/h1_042.png' + ')',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ height: '25px' }}></div>
                          <table width="100%">
                            <tbody>
                              {cartItems.map((item) => (
                                <tr key={item._id}>
                                  <td
                                    align="center"
                                    width="200"
                                    style={{ position: 'relative' }}
                                  >
                                    <div
                                      style={{ width: '90px', height: '90px' }}
                                    >
                                      <Image
                                        className={classes.z_tp_yuan}
                                        src={
                                          JSON.parse(item.image)[0].imagePath
                                        }
                                        alt={item.name}
                                        width={90}
                                        height={90}
                                      ></Image>
                                    </div>
                                  </td>
                                  <td
                                    width=""
                                    style={{
                                      fontWeight: '700',
                                      fontFamily: 'dotum',
                                      lineHeight: '18px',
                                      color: '#222',
                                    }}
                                  >
                                    {item.name}&nbsp;[안전거래]
                                  </td>
                                  <td
                                    align="center"
                                    width="120"
                                    style={{ fontSize: '11px', color: '#888' }}
                                  >
                                    {bankData.salerEmail}
                                  </td>
                                  <td
                                    align="center"
                                    width="120"
                                    style={{ position: 'relative' }}
                                  >
                                    <span>
                                      <Image
                                        src={'/naver/h1_016.png'}
                                        alt={''}
                                        width={'21px'}
                                        height={'16px'}
                                      ></Image>
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '13px',
                                        color: '#555',
                                        verticalAlign: 'top',
                                      }}
                                    >
                                      무료
                                    </span>
                                  </td>
                                  <td align="center" width="100">
                                    {item.quantity}개
                                  </td>
                                  <td align="center" width="100">
                                    -
                                  </td>
                                  <td
                                    align="center"
                                    width="150"
                                    style={{ fontWeight: '700', color: '#000' }}
                                  >
                                    {item.price * item.quantity}원
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ height: '10px' }}></div>
                        </div>
                        <div>
                          <Image
                            src={'/naver/h1_011.png'}
                            alt={''}
                            width={'1100px'}
                            height={'39px'}
                          ></Image>
                        </div>

                        <div
                          style={
                            {
                              // backgroundImage: 'url(' + '/naver/h1_048.png' + ')',
                            }
                          }
                        >
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td width="688" style={{ padding: '0 50px' }}>
                                  <div
                                    style={{
                                      marginTop: '15px',
                                      position: 'relative',
                                    }}
                                  >
                                    <Image
                                      src={'/naver/h1_017.png'}
                                      alt={''}
                                      layout={'fill'}
                                      objectFit={'contain'}
                                    ></Image>
                                  </div>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120">
                                          <div style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_026.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <input
                                            ref={deliverReceiverName}
                                            type="text"
                                            name="delivereceiverName"
                                            id="dd_sh_xingming"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '200px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            placeholder="수령인"
                                            value={receiverName}
                                            onChange={(e) =>
                                              SetReceiverName(e.target.value)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120">
                                          <div style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_028.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <select
                                            name="telNo1___1"
                                            id="dd_sh_hp1"
                                            className={classes.z_select}
                                            style={{ height: '30px' }}
                                            onChange={handleChangeContactNo1_1}
                                          >
                                            {phone_prefix.map((i) =>
                                              i == contactNo1_1 ? (
                                                <option
                                                  key={i}
                                                  value={i}
                                                  selected
                                                >
                                                  {i}
                                                </option>
                                              ) : (
                                                <option key={i} value={i}>
                                                  {i}
                                                </option>
                                              )
                                            )}
                                          </select>{' '}
                                          -
                                          <input
                                            ref={r_contactNo1_2}
                                            type="tel"
                                            name="telNo1_2"
                                            id="dd_sh_hp2"
                                            maxLength="4"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '50px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            value={contactNo1_2}
                                            onChange={handleChangeContactNo1_2}
                                          />{' '}
                                          -
                                          <input
                                            ref={r_contactNo1_3}
                                            type="tel"
                                            name="telNo1_3"
                                            id="dd_sh_hp3"
                                            maxLength="4"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '50px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            value={contactNo1_3}
                                            onChange={handleChangeContactNo1_3}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120">
                                          <div style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_029.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <select
                                            name="telNo2___1"
                                            id="dd_hp1"
                                            className={classes.z_select}
                                            style={{ height: '30px' }}
                                            onChange={handleChangeContactNo2_1}
                                          >
                                            {phone_prefix.map((i) =>
                                              i == contactNo2_1 ? (
                                                <option
                                                  key={i}
                                                  value={i}
                                                  selected
                                                >
                                                  {i}
                                                </option>
                                              ) : (
                                                <option key={i} value={i}>
                                                  {i}
                                                </option>
                                              )
                                            )}
                                          </select>{' '}
                                          -
                                          <input
                                            ref={r_contactNo2_2}
                                            type="tel"
                                            name="telNo2___2"
                                            id="dd_hp2"
                                            maxLength="4"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '50px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            value={contactNo2_2}
                                            onChange={handleChangeContactNo2_2}
                                          />{' '}
                                          -
                                          <input
                                            ref={r_contactNo2_3}
                                            type="tel"
                                            name="telNo2___3"
                                            id="dd_hp3"
                                            maxLength="4"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '50px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            value={contactNo2_3}
                                            onChange={handleChangeContactNo2_3}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120">
                                          <div style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_030.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <input
                                            ref={r_receiverAddress}
                                            type="text"
                                            name="detailAddress"
                                            id="dd_sh_dizhi1"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '350px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            value={receiverAddress}
                                            onChange={(e) =>
                                              SetReceiverAddress(e.target.value)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120" valign="top">
                                          <div style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_031.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              color: '#888',
                                              marginBottom: '10px',
                                            }}
                                          ></div>
                                          <input
                                            ref={r_receiverMemo}
                                            type="text"
                                            name="deliveryMemo"
                                            id="dd_memo"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '500px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            placeholder="배송메모를 입력하세요"
                                            value={receiverMemo}
                                            onChange={(e) =>
                                              SetReceiverMemo(e.target.value)
                                            }
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '15px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          width="20"
                                          style={{ position: 'relative' }}
                                        >
                                          <Image
                                            src={'/naver/h1_019.png'}
                                            alt={''}
                                            layout={'fill'}
                                            objectFit={'contain'}
                                          ></Image>
                                        </td>
                                        <td>
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              color: '#2db400',
                                            }}
                                          >
                                            도서산간 지역의 경우 추후 수령 시
                                            추가 배송비가 과금될 수 있습니다.
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div style={{ height: '30px' }}>&nbsp;</div>
                                </td>
                                <td valign="top">
                                  <div style={{ margin: '0 40px' }}>
                                    <div
                                      style={{
                                        marginTop: '15px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                      }}
                                    >
                                      주문자 정보
                                    </div>
                                    <div
                                      style={{
                                        borderTop: '1px solid #ddd',
                                        marginTop: '20px',
                                      }}
                                    ></div>
                                    <div
                                      style={{
                                        marginTop: '25px',
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: '#2db400',
                                        }}
                                      >
                                        주문자 정보로 결과관련 정보가
                                        제공됩니다.
                                      </span>
                                      <br />
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: '#2db400',
                                        }}
                                      >
                                        정확한 정보로 등록되어 있는지
                                        확인해주세요.
                                      </span>
                                      <br />
                                      <br />
                                      <span style={{ fontSize: '12px' }}>
                                        네이버페이에서 주문하고,
                                      </span>
                                      <br />
                                      <span style={{ fontSize: '12px' }}>
                                        주문정보 알림까지 한번에!
                                      </span>
                                      <br />
                                      <span style={{ fontSize: '12px' }}>
                                        네이버 앱 알림으로 지금 변경하세요.
                                      </span>
                                      <br />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <Image
                            src={'/naver/h1_013.png'}
                            alt={''}
                            layout={'fill'}
                            objectFit={'contain'}
                          ></Image>
                        </div>

                        <div
                          style={
                            {
                              // backgroundImage: 'url(' + '/naver/h1_048.png' + ')',
                            }
                          }
                        >
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td width="688" style={{ padding: '0 50px' }}>
                                  <div
                                    style={{
                                      marginTop: '15px',
                                      position: 'relative',
                                    }}
                                  >
                                    <Image
                                      src={'/naver/h1_018.png'}
                                      alt={''}
                                      layout={'fill'}
                                      objectFit={'contain'}
                                    ></Image>
                                  </div>

                                  <div
                                    style={{
                                      width: 'auto',
                                      height: '36px',
                                      textAlign: 'center',
                                      lineHeight: '36px',
                                      marginTop: '20px',
                                      backgroundColor: '#9aa4ae',
                                      color: '#fff',
                                      fontSize: '13px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    일반결제
                                  </div>

                                  <div
                                    style={{
                                      border: '1px solid #ddd',
                                      width: 'auto',
                                      padding: '15px',
                                    }}
                                  >
                                    <span>
                                      <Image
                                        src={'/naver/h1_023.png'}
                                        alt={''}
                                        width={'18px'}
                                        height={'18px'}
                                      ></Image>
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        lineHeight: '20px',
                                      }}
                                    >
                                      무통장입금
                                    </span>
                                  </div>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '25px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120" valign="top">
                                          <div>
                                            <Image
                                              src={'/naver/h1_033.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <table width="60%">
                                            <tbody>
                                              <tr>
                                                <td
                                                  width="20"
                                                  style={{
                                                    position: 'relative',
                                                  }}
                                                >
                                                  <Image
                                                    src={'/naver/h1_023.png'}
                                                    alt={''}
                                                    layout={'fill'}
                                                    objectFit={'contain'}
                                                  ></Image>
                                                </td>
                                                <td
                                                  width="100"
                                                  style={{ fontSize: '12px' }}
                                                >
                                                  환불정산액 적립
                                                </td>
                                                <td
                                                  width="20"
                                                  style={{
                                                    position: 'relative',
                                                  }}
                                                >
                                                  <Image
                                                    src={'/naver/h1_024.png'}
                                                    alt={''}
                                                    layout={'fill'}
                                                    objectFit={'contain'}
                                                  ></Image>
                                                </td>
                                                <td
                                                  style={{ fontSize: '12px' }}
                                                >
                                                  본인계좌환불
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    width="100%"
                                    style={{
                                      marginTop: '25px',
                                      display: 'none',
                                    }}
                                    id="giezhua"
                                  >
                                    <tbody>
                                      <tr>
                                        <td valign="top">&nbsp;</td>
                                        <td>&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td
                                          valign="top"
                                          style={{
                                            fontSize: '12px',
                                            padding: '10px 10px',
                                          }}
                                        >
                                          환불은행
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '200px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            placeholder=""
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          valign="top"
                                          style={{
                                            fontSize: '12px',
                                            padding: '10px 10px',
                                          }}
                                        >
                                          예금주
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '200px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            placeholder=""
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          valign="top"
                                          style={{
                                            fontSize: '12px',
                                            padding: '10px 10px',
                                          }}
                                        >
                                          계좌번호
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            style={{
                                              border: '1px solid #eaeaea',
                                              width: '200px',
                                              height: '26px',
                                              textIndent: '5px',
                                            }}
                                            placeholder=""
                                          />
                                        </td>
                                      </tr>
                                      <tr>
                                        <td width="120" valign="top">
                                          &nbsp;
                                        </td>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div
                                    style={{
                                      borderTop: '1px solid #eee',
                                      marginTop: '30px',
                                    }}
                                  ></div>

                                  <div
                                    style={{
                                      height: '50px',
                                      border: '1px solid #eee',
                                      backgroundColor: '#f1fff6',
                                      marginTop: '10px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Image
                                      src={'/naver/h1_021.png'}
                                      alt={''}
                                      width={'355'}
                                      height={'17'}
                                    ></Image>
                                  </div>

                                  <table
                                    width="100%"
                                    style={{ marginTop: '25px' }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td width="120" valign="top">
                                          <div>
                                            <Image
                                              src={'/naver/h1_034.png'}
                                              alt={''}
                                              width={'95'}
                                              height={'22'}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td>
                                          <table width="60%">
                                            <tbody>
                                              <tr>
                                                <td
                                                  width="20"
                                                  style={{
                                                    position: 'relative',
                                                  }}
                                                >
                                                  <Image
                                                    src={'/naver/h1_023.png'}
                                                    alt={''}
                                                    layout={'fill'}
                                                    objectFit={'contain'}
                                                  ></Image>
                                                </td>
                                                <td
                                                  width="60"
                                                  style={{ fontSize: '12px' }}
                                                >
                                                  신청하기
                                                </td>
                                                <td
                                                  width="20"
                                                  style={{
                                                    position: 'relative',
                                                  }}
                                                >
                                                  <Image
                                                    src={'/naver/h1_024.png'}
                                                    alt={''}
                                                    layout={'fill'}
                                                    objectFit={'contain'}
                                                  ></Image>
                                                </td>
                                                <td
                                                  style={{ fontSize: '12px' }}
                                                >
                                                  신청안함
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div className={classes.fanhuan_div}>
                                    <div style={{ marginTop: '10px' }}>
                                      <table style={{ fontSize: '12px' }}>
                                        <tbody>
                                          <tr>
                                            <td
                                              width="100"
                                              style={{ textIndent: '10px' }}
                                            >
                                              현금영수증번호
                                            </td>
                                            <td style={{ textIndent: '10px' }}>
                                              <input
                                                type="text"
                                                name="fanhuan_01"
                                                id="fanhuan_01"
                                                style={{
                                                  border: '1px solid #eaeaea',
                                                  width: '200px',
                                                  height: '26px',
                                                  textIndent: '5px',
                                                }}
                                                value={billNo}
                                                onChange={(e) =>
                                                  SetBillNo(e.target.value)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <div style={{ marginTop: '5px' }}>
                                      <table style={{ fontSize: '12px' }}>
                                        <tbody>
                                          <tr>
                                            <td
                                              width="100"
                                              style={{ textIndent: '10px' }}
                                            >
                                              핸드폰번호
                                            </td>
                                            <td style={{ textIndent: '10px' }}>
                                              <input
                                                type="text"
                                                name="fanhuan_02"
                                                id="fanhuan_02"
                                                style={{
                                                  border: '1px solid #eaeaea',
                                                  width: '200px',
                                                  height: '26px',
                                                  textIndent: '5px',
                                                }}
                                                value={billPhoneNo}
                                                onChange={(e) =>
                                                  SetBillPhoneNo(e.target.value)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      padding: '20px',
                                      fontSize: '12px',
                                      lineHeight: '18px',
                                      backgroundColor: '#ececec',
                                      marginTop: '20px',
                                    }}
                                  >
                                    본 가맹점은 현금영수증 자동발급가맹점
                                    입니다. <br />
                                    네이버 페이 결제 시, 네이버페이
                                    포인트/실시간
                                    계좌이체/무통장입금(가상계좌)를 이용한 경우
                                    현금 영수증 신청을 할수 있습니다.
                                  </div>

                                  <div
                                    style={{
                                      borderTop: '1px solid #eee',
                                      marginTop: '40px',
                                    }}
                                  ></div>

                                  <div
                                    style={{
                                      marginTop: '40px',
                                    }}
                                  >
                                    <Image
                                      src={'/naver/h1_050.png'}
                                      alt={'1'}
                                      width={'23'}
                                      height={'23'}
                                    ></Image>
                                    <Image
                                      src={'/naver/h1_055.png'}
                                      alt={''}
                                      width={'100'}
                                      height={'23'}
                                    ></Image>
                                  </div>
                                  <div style={{ marginTop: '10px' }}>
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td style={{ position: 'relative' }}>
                                            <Image
                                              src={'/naver/h1_054.png'}
                                              alt={'1'}
                                              layout={'fill'}
                                              objectFit={'contain'}
                                            ></Image>
                                          </td>
                                          <td>
                                            <Image
                                              src={'/naver/h1_052.png'}
                                              alt={'1'}
                                              width={'23'}
                                              height={'23'}
                                            ></Image>
                                          </td>
                                          <td
                                            style={{
                                              fontSize: '12px',
                                              color: '#888',
                                            }}
                                          >
                                            &nbsp;위 상품의 구매조건 확인 및
                                            결제진행 동의
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div
                                    style={{
                                      padding: '15px 20px',
                                      backgroundColor: '#f2f2f2',
                                      marginTop: '40px',
                                    }}
                                  >
                                    <div>
                                      <span
                                        style={{
                                          fontSize: '13px',
                                          fontWeight: '700',
                                          color: '#2db400',
                                        }}
                                      >
                                        잠깐! &nbsp;
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '13px',
                                          fontWeight: '700',
                                        }}
                                      >
                                        내 택배 어디쯤왔는지 궁금하시죠?
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '10px',
                                        lineHeight: '18px',
                                      }}
                                    >
                                      <span style={{ fontSize: '12px' }}>
                                        배송출발부터 도착까지! &nbsp;
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: '#2db400',
                                        }}
                                      >
                                        실시간으로 안내되는 네이버 알림 &nbsp;
                                      </span>
                                      <span style={{ fontSize: '12px' }}>
                                        지금 변경해보세요~{' '}
                                      </span>{' '}
                                      <br />
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: '#2db400',
                                        }}
                                      >
                                        이제 SMS보다 네이버 알림!{' '}
                                      </span>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                      <table width="60%">
                                        <tbody>
                                          <tr>
                                            <td
                                              width="20"
                                              style={{ position: 'relative' }}
                                            >
                                              <Image
                                                src={'/naver/h1_023.png'}
                                                alt={''}
                                                layout={'fill'}
                                                objectFit={'contain'}
                                              ></Image>
                                            </td>
                                            <td
                                              width="120"
                                              style={{
                                                fontSize: '12px',
                                                fontWeight: '700',
                                              }}
                                            >
                                              네이버 알림 받기
                                            </td>
                                            <td
                                              width="20"
                                              style={{ position: 'relative' }}
                                            >
                                              <Image
                                                src={'/naver/h1_024.png'}
                                                alt={''}
                                                layout={'fill'}
                                                objectFit={'contain'}
                                              ></Image>
                                            </td>
                                            <td style={{ fontSize: '12px' }}>
                                              SMS 알림 받기
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  <div style={{ height: '50px' }}>&nbsp;</div>
                                </td>

                                <td valign="top">
                                  <div style={{ margin: '0 40px' }}>
                                    <div
                                      style={{
                                        marginTop: '25px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                      }}
                                    >
                                      결제금액
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                      <span
                                        style={{
                                          fontSize: '28px',
                                          fontWeight: '700',
                                        }}
                                      >
                                        {totalPrice}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: '16px',
                                          fontWeight: '700',
                                        }}
                                      >
                                        원
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        borderTop: '1px solid #ddd',
                                        marginTop: '30px',
                                      }}
                                    ></div>
                                    <div style={{ marginTop: '30px' }}>
                                      <table width="100%">
                                        <tbody>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'gulim',
                                                color: '#888',
                                              }}
                                            >
                                              총 상품금액
                                            </td>
                                            <td
                                              align="right"
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'gulim',
                                                color: '#888',
                                              }}
                                            >
                                              {totalPrice}원
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                      <table width="100%">
                                        <tbody>
                                          <tr>
                                            <td
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'gulim',
                                                color: '#888',
                                              }}
                                            >
                                              배송비
                                            </td>
                                            <td
                                              align="right"
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'gulim',
                                                color: '#888',
                                              }}
                                            >
                                              무료
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div
                                      style={{
                                        borderTop: '1px solid #ddd',
                                        marginTop: '30px',
                                      }}
                                    ></div>
                                    <div style={{ marginTop: '80px' }}>
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td
                                              width=""
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'gulim',
                                                color: '#000',
                                                fontWeight: '700',
                                              }}
                                            >
                                              무통장입금 안내
                                            </td>
                                            <td
                                              style={{ position: 'relative' }}
                                            >
                                              <Image
                                                src={'/naver/h1_020.png'}
                                                alt={''}
                                                layout={'fill'}
                                                objectFit={'contain'}
                                              ></Image>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '20px',
                                        fontSize: '12px',
                                        lineHeight: '22px',
                                      }}
                                    >
                                      <span style={{ color: '#2db400' }}>
                                        주문자명과 입금자명이 다르더라도{' '}
                                      </span>
                                      <span style={{ color: '#777' }}>
                                        발급된 가상계좌번호로 정확한 금액을
                                        입금하시면 정상 입금확인이 가능합니다.
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '20px',
                                        fontSize: '12px',
                                        lineHeight: '22px',
                                      }}
                                    >
                                      <span style={{ color: '#777' }}>
                                        무통장입금시,{' '}
                                      </span>
                                      <span style={{ color: '#2db400' }}>
                                        농협, 국민, 우체국, 부산, SC 제일은행은
                                        통장/카드 없이 현금으로 ATM 기기 입금이
                                        불가능합니다.{' '}
                                      </span>
                                      <span style={{ color: '#777' }}>
                                        이 경우 은행 창구 또는 인터넷 뱅킹을
                                        이용해 주시기 바랍니다.
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        borderTop: '1px solid #ddd',
                                        marginTop: '30px',
                                      }}
                                    ></div>
                                    <div
                                      style={{
                                        marginTop: '30px',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                      }}
                                    >
                                      최대 2% 혜택 받는 포인트플러스
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '10px',
                                        fontWeight: '700',
                                        fontSize: '12px',
                                      }}
                                    >
                                      <table>
                                        <tbody>
                                          <tr>
                                            <td width="">구매안전 서비스</td>
                                            <td
                                              style={{ position: 'relative' }}
                                            >
                                              <Image
                                                src={'/naver/h1_020.png'}
                                                alt={''}
                                                layout={'fill'}
                                                objectFit={'contain'}
                                              ></Image>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <Image
                            src={'/naver/h1_012.png'}
                            alt={''}
                            width={'1100'}
                            height={'39'}
                          ></Image>
                        </div>

                        <div
                          style={{
                            height: '100px',
                            // backgroundImage: 'url(' + '/naver/h1_049.png' + ')',
                          }}
                        >
                          <div
                            style={{ textAlign: 'center', paddingTop: '20px' }}
                          >
                            <input
                              type="image"
                              src="/naver/h1_022.png"
                              onClick={submitForm}
                            />
                          </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <Image
                            src={'/naver/h1_014.png'}
                            alt={''}
                            layout={'fill'}
                            objectFit={'contain'}
                          ></Image>
                        </div>
                        <div style={{ height: '50px' }}></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
