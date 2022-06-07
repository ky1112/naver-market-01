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

export default function Login() {
  const router = useRouter();
  const [userId, SetUserId] = useState('');
  const [userPwd, SetUserPwd] = useState('');

  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    // if (userInfo) {
    //   router.push('/');
    // }
  }, []);

  const classes = useStyles();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const nUInfo = {
        naverUserID: userId,
        naverUserPwd: userPwd,
      };

      dispatch({ type: 'NAVER_USER_LOGIN', payload: nUInfo });
      Cookies.set('naverUserInfo', nUInfo);
      console.log(nUInfo);
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
                  type="text"
                  id="username"
                  name="username"
                  className={classes.login_naver_username}
                  placeHolder="아이디"
                  value={userId}
                  onChange={(e) => SetUserId(e.target.value)}
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={classes.login_naver_password}
                  placeHolder="비밀번호"
                  value={userPwd}
                  onChange={(e) => SetUserPwd(e.target.value)}
                />
                <button type="submit" className={classes.login_naver_submit}>
                  로그인
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
                        로그인 상태 유지
                      </a>
                    </td>
                    <td style={{ fontSize: '12px', color: '#777' }}>
                      IP보안 <span style={{ fontWeight: '700' }}>OFF</span>{' '}
                      <span style={{ fontSize: '10px' }}>|</span> 일회용 로그인
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
                아이디 찾기
              </a>
              <a
                href="https://nid.naver.com/nidreminder.form"
                style={{ fontSize: '12px', marginRight: '20px', color: '#888' }}
              >
                비밀번호 찾기
              </a>
              <a
                href="https://nid.naver.com/user/join.html?lang=ko_KR"
                style={{ fontSize: '12px', color: '#888' }}
              >
                회원가입
              </a>
            </div>
            <div className={classes.z_login_nr_05}>
              <div className={classes.z_login_nr_0501}>
                <a
                  href="http://pay.naver.cafe-226.com/login.php?pd=co.kr19#"
                  style={{ marginLeft: '7px' }}
                >
                  이용약관
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
                  개인정보처리방침
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
                  책임의 한계와 법적고지
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
                  회원정보 고객센터
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
