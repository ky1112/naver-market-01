import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import CategoryBody from './CategoryBody';
import { useRouter } from 'next/router';
import axios from 'axios';

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

export default function Category() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickCategorySearch = async (
    searchType,
    searchId,
    searchName
  ) => {
    console.log(searchId, searchType);
    setAnchorEl(null);
    if (searchType == 'tag') {
      const { data } = await axios.get(
        `/api/categories/get_category_by_tagid?id=${searchId}`
      );
      //console.log(data[0]);
      router.push(`/search?category=${data[0].name}&tagName=${searchName}`);
    } else {
      router.push(`/search?category=${searchName}`);
    }
    //router.push(`/search?category=${category}&tagName=${tagName}`);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        카테고리
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <CategoryBody handleClickCategorySearch={handleClickCategorySearch} />
      </StyledMenu>
    </div>
  );
}
