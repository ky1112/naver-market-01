import { makeStyles /*rgbToHex*/ } from '@material-ui/core';
// import { urlObjectKeys } from 'next/dist/next-server/lib/utils';

const useStyles = makeStyles((theme) => ({
  navbar: {
    //backgroundColor: '#203040',
    backgroundColor: '#ffffff',
    '& a': {
      color: '#0484F6',
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    maxWidth: 800,
    margin: '0 auto',
  },
  navbarButton: {
    color: '#0484F6',
    textTransform: 'initial',
  },
  transparentBackgroud: {
    backgroundColor: 'transparent',
  },
  error: {
    color: '#f04040',
  },
  fullWidth: {
    width: '100%',
  },
  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  menuButton: { padding: 0 },
  mt1: { marginTop: '1rem' },
  // search
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  searchForm: {
    border: '1px solid #9ea4aa',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },
  sort: {
    marginRight: 5,
  },

  fullContainer: { height: '100vh' },
  mapInputBox: {
    position: 'absolute',
    display: 'flex',
    left: 0,
    right: 0,
    margin: '10px auto',
    width: 300,
    height: 40,
    '& input': {
      width: 250,
    },
  },

  spands: {
    marginLeft: '10px',
  },

  /* naver style */
  z_login_wr: { width: '100%', marginTop: '80px' },
  z_login_jz: { maxWidth: '860px', width: '450px', margin: '0 auto' },
  z_login_nr: { width: '100%', marginTop: '50px' },
  z_login_nr_01: { width: '450px', textAlign: 'center', marginBottom: '50px' },
  z_login_nr_02: { width: '100%', outline: '0px solid red' },
  login_naver_username: {
    width: '448px',
    height: '40px',
    border: '1px solid #ddd',
    textIndent: '15px',
  },

  login_naver_password: {
    width: '448px',
    height: '40px',
    border: '1px solid #ddd',
    textIndent: '15px',
    marginTop: '15px',
  },
  login_naver_submit: {
    width: '100%',
    height: '61px',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#1fbc02',
    border: '0',
    marginTop: '25px',
    fontSize: '20px',
    cursor: 'pointer',
  },
  z_login_nr_03: { marginTop: '20px' },
  z_login_nr_04: {
    marginTop: '25px',
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
    textAlign: 'center',
  },
  z_login_nr_05: { marginTop: '100px' },
  z_login_nr_0501: { fontSize: '12px' },
  z_login_nr_0502: { textAlign: 'center', marginTop: '10px' },

  h1_01_wr: {
    width: '100%',
    height: '110px',
    backgroundImage: 'url(' + '/naver/h1_001.png' + ')',
    display: 'block',
  },
  h1_01_jz: { width: '1100px', margin: '0 auto' },
  h1_01_nr: { width: 'auto' },
  h1_01_nr_01: { width: 'auto' },
  h1_01_nr_02: { width: 'auto', marginTop: '15px' },

  h1_02_wr: { width: '100%', backgroundColor: '#f3f4f5' },
  h1_02_jz: { width: '1100px', margin: '0 auto' },
  h1_02_nr: { width: 'auto' },
  z_tp_yuan: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  h1_03_wr: { width: '100%', marginTop: '40px' },
  h1_03_jz: { width: '1100px', margin: '0 auto' },
  h1_03_nr: { width: 'auto' },
  naverpayform: {
    display: 'block',
    '& td': {
      position: 'relative',
    },
  },
  td_img: { position: 'relative' },

  q1_wr: { width: '100%', marginTop: '100px' },
  q1_jz: { width: '800px', margin: '0 auto' },
  q1_nr: { width: 'auto' },
  q1_nr_01: {
    width: 'auto',
    backgroundColor: '#00c73c',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    textIndent: '15px',
    lineHeight: '35px',
    height: '35px',
  },
  q1_nr_02: { width: 'auto', height: '140px', border: '1px solid #ddd' },
  q1_nr_0201: {
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '50px',
    color: '#000',
  },
  q1_nr_0202: {
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '10px',
    color: '#000',
  },
  q1_nr_03: { marginTop: '15px', textAlign: 'center' },
  q1_btn_01: {
    border: '1px solid #ddd',
    fontWeight: '700',
    width: '60px',
    height: '30px',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
  },
  q1_btn_02: {
    border: '1px solid #ddd',
    fontWeight: '700',
    width: '60px',
    height: '30px',
    backgroundColor: '#fff',
    color: '#666',
    cursor: 'pointer',
  },
  h1_02_nr_div_01: {
    backgroundImage: 'url(' + '/naver/h2_015.png' + ')',
    position: 'relative',
  },
  h1_02_nr_div_02: {
    width: '343px',
    position: 'absolute',
    zIndex: '10',
    left: '720px',
    top: '-19px',
  },
}));
export default useStyles;
