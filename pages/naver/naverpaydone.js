import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function NaverPayDone() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const { naverDeliverInfo } = state;

  const [totalPrice, SetTotalPrice] = useState(0);
  const [orderTime, SetOrderTime] = useState('');
  const [loading, SetLoading] = useState(true);
  const [bankData, SetBankData] = useState({
    salerName: '',
    salerEmail: '',
    bankName: '',
    bankDescription: '',
    ownerName: '',
    payValidDate: '',
  });
  const classes = useStyles();

  useEffect(() => {
    if (naverDeliverInfo == null || naverDeliverInfo.orderNo == null) {
      router.push('/');
      return;
    }

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

      const year = new Date().getFullYear();
      const month = ('0' + (new Date().getMonth() + 1)).slice(-2);
      const day = ('0' + new Date().getDate()).slice(-2);
      SetOrderTime(year + '.' + month + '.' + day);

      var sum = 0;
      cartItems.map((item) => {
        sum = sum + item.price * item.quantity;
      });

      SetTotalPrice(sum);
      SetLoading(false);
    };

    fetchData();
  }, []);

  const handleGoHome = async () => {
    router.push('/');
    dispatch({ type: 'CART_CLEAR' });
    Cookies.remove('naverDeliverInfo');
  };
  return (
    <>
      {loading ? (
        <>
          <CircularProgress />
        </>
      ) : (
        <>
          <div className={classes.h1_01_wr}>
            <div className={classes.h1_01_jz}>
              <div className={classes.h1_01_nr}>
                <div className={classes.h1_01_nr_01}>
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td width="400">
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td width="60">
                                  <a href="https://www.naver.com/">
                                    <Image
                                      src={'/naver/h1_002.png'}
                                      alt={''}
                                      width={'48px'}
                                      height={'30px'}
                                    ></Image>
                                  </a>
                                </td>
                                <td>
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
                                    href="https://order.pay.naver.com/main/cart"
                                    style={{ fontSize: '12px', color: '#fff' }}
                                  >
                                    ????????????
                                  </a>
                                </td>
                                <td align="right" width="40">
                                  <a href="javascript:;">
                                    <Image
                                      src={'/naver/h1_004.png'}
                                      alt={''}
                                      width={'30px'}
                                      height={'30px'}
                                    ></Image>
                                  </a>
                                </td>
                                <td align="right" width="25">
                                  <a href="javascript:;">
                                    <Image
                                      src={'/naver/h1_005.png'}
                                      alt={''}
                                      width={'22'}
                                      height={'30'}
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
                        <td width="200">
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
                                    ????????????
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
                                    ?????????
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
                                    ??????
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
                                    ?????????
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
                                    ?????????????????
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
                                    ??????????????
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
                      <td valign="top">
                        <div>
                          <Image
                            src={'/naver/h1_007.png'}
                            alt={''}
                            width={'1100px'}
                            height={'41px'}
                          ></Image>
                        </div>

                        <div>
                          <Image
                            src={'/naver/h2_014.png'}
                            alt={''}
                            width={'1100px'}
                            height={'20px'}
                          ></Image>
                        </div>

                        <div className={classes.h1_02_nr_div_01}>
                          <div className={classes.h1_02_nr_div_02}>
                            <div
                              style={{
                                height: '10px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                              }}
                            ></div>

                            <div
                              style={{
                                backgroundImage:
                                  'url(' + '/naver/h2_002.png' + ')',
                                padding: '30px',
                              }}
                            >
                              <div style={{ textAlign: 'center' }}>
                                <Image
                                  src={'/naver/h2_005.png'}
                                  alt={''}
                                  width={'115'}
                                  height={'44'}
                                ></Image>
                              </div>
                              <div
                                style={{
                                  borderTop: '1px solid #ddd',
                                  marginTop: '30px',
                                }}
                              ></div>
                              <div style={{ marginTop: '15px' }}>
                                <table>
                                  <tbody>
                                    {cartItems.map((item) => (
                                      <tr key={item._id}>
                                        <td valign="top" width="90">
                                          <div
                                            style={{
                                              width: '75px',
                                              height: '75px',
                                            }}
                                          >
                                            <Image
                                              className={classes.z_tp_yuan}
                                              src={
                                                JSON.parse(item.image)[0]
                                                  .imagePath
                                              }
                                              alt={item.name}
                                              width={90}
                                              height={90}
                                            ></Image>
                                          </div>
                                        </td>
                                        <td valign="top">
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              marginTop: '10px',
                                            }}
                                          >
                                            [{item.name}
                                            [????????????]]
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              marginTop: '10px',
                                              color: '#888',
                                              fontFamily: '&#39;dotum&#39;',
                                            }}
                                          >
                                            <Image
                                              src={'/naver/h2_004.png'}
                                              alt={''}
                                              width={'17'}
                                              height={'14'}
                                              className={classes.z_tp_yuan}
                                            ></Image>
                                            &nbsp;****
                                          </div>
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              marginTop: '10px',
                                            }}
                                          >
                                            {item.price}??? X {item.quantity}???=
                                            {item.price * item.quantity}???
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  borderTop: '1px solid #ddd',
                                  marginTop: '20px',
                                }}
                              ></div>
                              <div style={{ marginTop: '15px' }}>
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="150">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          ??? ????????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          {totalPrice}???
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  marginTop: '10px',
                                }}
                              >
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="150">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          ?????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          0???
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  marginTop: '10px',
                                }}
                              >
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="150">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          ?????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          (+) ???
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  marginTop: '10px',
                                }}
                              >
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="150">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          ????????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          (-) ???
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  marginTop: '10px',
                                }}
                              >
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="150">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          ?????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            color: '#777',
                                          }}
                                        >
                                          (-) 0???
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  borderTop: '1px solid #ddd',
                                  marginTop: '20px',
                                }}
                              ></div>
                              <div style={{ marginTop: '20px' }}>
                                <table width="100%">
                                  <tbody>
                                    <tr>
                                      <td width="80">
                                        <div
                                          style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                          }}
                                        >
                                          ????????????
                                        </div>
                                      </td>
                                      <td align="right">
                                        <div style={{ fontSize: '12px' }}>
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
                                            ???
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div style={{ height: '10px' }}></div>
                            </div>

                            <div>
                              <Image
                                src={'/naver/h2_003.png'}
                                alt={''}
                                width={'343'}
                                height={'33px'}
                              ></Image>
                            </div>
                          </div>

                          <div style={{ margin: '0 45px' }}>
                            <div style={{ paddingTop: '50px' }}>
                              <Image
                                src={'/naver/h2_001.png'}
                                alt={''}
                                width={'365'}
                                height={'45'}
                              ></Image>
                            </div>

                            <div
                              style={{
                                marginTop: '10px',
                              }}
                            >
                              <span
                                style={{ color: '#2db400', fontSize: '15px' }}
                              >
                                {orderTime}
                              </span>
                              <span style={{ fontSize: '15px' }}>
                                ????????? ??????????????????, ????????? ???????????????.
                              </span>
                            </div>

                            <div style={{ marginTop: '30px' }}>
                              <span
                                style={{ color: '#2db400', fontSize: '12px' }}
                              >
                                ?????????/??????????????? ?????????{' '}
                              </span>
                              <span style={{ fontSize: '12px' }}>
                                ????????????????????? ????????? ?????? ?????? ??? ?????? ?????????
                              </span>
                            </div>

                            <div
                              style={{
                                borderTop: '1px solid #eee',
                                marginTop: '40px',
                              }}
                            ></div>

                            <div style={{ marginTop: '40px' }}>
                              <table width="100%">
                                <tbody>
                                  <tr>
                                    <td valign="top" width="130">
                                      <span
                                        style={{
                                          fontWeight: '700',
                                          fontSize: '13px',
                                        }}
                                      >
                                        ????????????
                                      </span>
                                    </td>
                                    <td valign="top">
                                      <span
                                        style={{
                                          color: '#2db400',
                                          fontSize: '13px',
                                          fontWeight: '700',
                                        }}
                                      >
                                        {naverDeliverInfo.orderNo}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <table width="100%">
                                <tbody>
                                  <tr>
                                    <td valign="top" width="130">
                                      <span
                                        style={{
                                          fontWeight: '700',
                                          fontSize: '13px',
                                        }}
                                      >
                                        ????????? ??????
                                      </span>
                                    </td>
                                    <td valign="top">
                                      <div style={{ fontSize: '13px' }}>
                                        {naverDeliverInfo.fullName}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '13px',
                                          marginTop: '10px',
                                        }}
                                      >
                                        {naverDeliverInfo.contactNo1}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '13px',
                                          marginTop: '10px',
                                        }}
                                      >
                                        - {naverDeliverInfo.address}
                                        -&nbsp;&nbsp;
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                              <table width="100%">
                                <tbody>
                                  <tr>
                                    <td valign="top" width="130">
                                      <span
                                        style={{
                                          fontWeight: '700',
                                          fontSize: '13px',
                                        }}
                                      >
                                        ????????????
                                      </span>
                                    </td>
                                    <td valign="top">
                                      <div style={{ fontSize: '13px' }}>
                                        {bankData.bankName}
                                      </div>
                                      <div
                                        style={{
                                          marginTop: '10px',
                                        }}
                                      >
                                        <table>
                                          <tbody>
                                            <tr>
                                              <td width="67">
                                                <span
                                                  style={{ fontSize: '13px' }}
                                                >
                                                  ????????????&nbsp;:&nbsp;
                                                </span>
                                              </td>
                                              <td>
                                                <span
                                                  style={{
                                                    fontSize: '13px',
                                                    color: '#2db400',
                                                  }}
                                                >
                                                  {bankData.bankDescription}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div
                                        style={{
                                          marginTop: '10px',
                                        }}
                                      >
                                        <table>
                                          <tbody>
                                            <tr>
                                              <td width="67">
                                                <span
                                                  style={{
                                                    fontSize: '13px',
                                                    letterSpacing: '1px',
                                                  }}
                                                >
                                                  ??? ??? ???&nbsp;:&nbsp;
                                                </span>
                                              </td>
                                              <td>
                                                <span
                                                  style={{
                                                    fontSize: '13px',
                                                    color: '#2db400',
                                                  }}
                                                >
                                                  {bankData.ownerName}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div
                                        style={{
                                          marginTop: '10px',
                                        }}
                                      >
                                        <table>
                                          <tbody>
                                            <tr>
                                              <td width="67">
                                                <span
                                                  style={{ fontSize: '13px' }}
                                                >
                                                  ????????????&nbsp;:&nbsp;
                                                </span>
                                              </td>
                                              <td>
                                                <span
                                                  style={{
                                                    fontSize: '13px',
                                                    color: '#2db400',
                                                  }}
                                                >
                                                  {bankData.payValidDate}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div
                              style={{
                                borderTop: '1px solid #eee',
                                marginTop: '80px',
                              }}
                            ></div>
                            <div style={{ height: '40px' }}></div>
                          </div>
                        </div>

                        <div>
                          <Image
                            src={'/naver/h2_011.png'}
                            alt={''}
                            width={'1100'}
                            height={'32'}
                          ></Image>
                        </div>

                        <div
                          style={{
                            height: '100px',
                            backgroundImage: 'url(' + '/naver/h1_049.png' + ')',
                          }}
                        >
                          <div
                            style={{ textAlign: 'center', paddingTop: '20px' }}
                          >
                            <a href="#" onClick={handleGoHome}>
                              <Image
                                src={'/naver/h2_010.png'}
                                alt={''}
                                width={'175'}
                                height={'50'}
                              ></Image>
                            </a>
                          </div>
                        </div>

                        <div>
                          <Image
                            src={'/naver/h1_014.png'}
                            alt={''}
                            width={'1100'}
                            height={'20'}
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

          <div className={classes.h1_03_wr}>
            <div className={classes.h1_03_jz}>
              <div className={classes.h1_03_nr}>
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  <a
                    href="https://pay.naver.com/provision"
                    style={{ marginRight: '10px' }}
                  >
                    ??????????????? ????????????
                  </a>
                  <a
                    href="https://pay.naver.com/provision?viewType=electronic"
                    style={{ marginRight: '10px' }}
                  >
                    ?????????????????? ????????????
                  </a>
                  <a
                    href="https://policy.naver.com/policy/privacy.html"
                    style={{ marginRight: '10px', fontWeight: '700' }}
                  >
                    ????????????????????????
                  </a>
                  <a
                    href="https://policy.naver.com/policy/youthpolicy.html"
                    style={{ marginRight: '10px' }}
                  >
                    ?????????????????????
                  </a>
                  <a
                    href="https://help.pay.naver.com/"
                    style={{ marginRight: '10px' }}
                  >
                    ??????&amp;?????? ????????????
                  </a>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    height: '34px',
                    lineHeight: '34px',
                    backgroundColor: '#f9f9fa',
                  }}
                >
                  <span style={{ fontWeight: '700', marginRight: '10px' }}>
                    ???????????? ??????
                  </span>
                  <span style={{ marginRight: '10px' }}>
                    ????????? ????????? ????????? 89 ????????????????????????
                  </span>
                  <span style={{ fontWeight: '700', marginRight: '10px' }}>
                    ??????
                  </span>
                  <span style={{ marginRight: '10px' }}>
                    1588-3819{' '}
                    <a
                      href="https://help.pay.naver.com/"
                      style={{ textDecoration: 'underline' }}
                    >
                      (???????????????)
                    </a>
                  </span>
                  <span style={{ marginRight: '10px' }}>1588-3816</span>
                  <span style={{ marginRight: '10px' }}>(??????????????????)</span>
                  <span style={{ fontWeight: '700', marginRight: '10px' }}>
                    ??????
                  </span>
                  <span style={{ marginRight: '10px' }}>033-816-5300</span>
                  <span style={{ fontWeight: '700', marginRight: '10px' }}>
                    ?????????
                  </span>
                  <span style={{ marginRight: '10px' }}>
                    <a
                      href="mailto:helpcustomer@naver.com"
                      style={{ textDecoration: 'underline' }}
                    >
                      helpcustomer@naver.com
                    </a>
                  </span>
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#aaa',
                  }}
                >
                  ??????????????? ??????????????? ????????? ?????? ???????????????????????????
                  ??????????????? ???????????? ????????????. ????????? ??????, ??????, ?????? ??????
                  ????????? ????????? ????????? ??????????????? ????????????.
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '12px',
                  }}
                >
                  ???????????? : ????????? ?????? : ????????? ????????? ????????? ????????? 6 ?????????
                  ??????????????? 13561 ????????????????????? : 220-81-62517
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '12px',
                  }}
                >
                  ??????????????????????????? : ???2006-????????????-692??? ???????????????????????????
                  ????????? ????????? ?????? : NAVER Business Platform
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Image
                    src={'/naver/n_080.png'}
                    alt={''}
                    width={'80'}
                    height={'13'}
                  ></Image>
                </div>

                <div style={{ height: '80px' }}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
