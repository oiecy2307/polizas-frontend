import React from 'react';
import PropTypes from 'prop-types';

import { Paper } from 'utils/globalStyledComponents';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TablePagination from '@material-ui/core/TablePagination';
import { Container } from './styledComponents';

function TableComponent(props) {
  const {
    columns,
    items,
    withMenu,
    optionsMenu,
    count,
    rowsPerPage,
    page,
    onPageChanged,
    showPagination,
    isClickable,
    onRowClicked,
    showHead,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleOpenMenu = item => event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOnOptionMenuClicked = action => () => {
    action(selectedItem);
    handleCloseMenu();
  };

  const handleChangePage = (e, newPage) => {
    onPageChanged(newPage);
  };

  const handleClickRow = item => () => {
    if (isClickable) {
      onRowClicked(item);
    }
  };

  return (
    <Paper>
      <Container>
        <Table>
          {showHead && (
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.label}
                    align={column.align || 'left'}
                    style={column.style ? column.style : {}}
                  >
                    {column.label}
                  </TableCell>
                ))}
                {withMenu && <TableCell />}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {items.map(item => (
              <TableRow
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                onClick={handleClickRow(item)}
                key={item.id}
              >
                {columns.map(column => (
                  <TableCell
                    key={column.label}
                    align={column.align || 'left'}
                    style={column.style ? column.style : {}}
                  >
                    {item[column.key]}
                  </TableCell>
                ))}
                {withMenu && !item.hideMenu && (
                  <TableCell align="center">
                    <IconButton
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleOpenMenu(item)}
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
                {withMenu && item.hideMenu && <TableCell />}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {showPagination && (
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={handleChangePage}
            labelDisplayedRows={({ from, to }) => `${from}-${to} de ${count}`}
          />
        )}
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {optionsMenu.map(({ option, action }) => (
            <MenuItem key={option} onClick={handleOnOptionMenuClicked(action)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </Paper>
  );
}

TableComponent.propTypes = {
  columns: PropTypes.array,
  items: PropTypes.array,
  withMenu: PropTypes.bool,
  optionsMenu: PropTypes.array,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  onPageChanged: PropTypes.func,
  showPagination: PropTypes.bool,
  isClickable: PropTypes.bool,
  onRowClicked: PropTypes.func,
  showHead: PropTypes.bool,
};

TableComponent.defaultProps = {
  columns: [],
  items: [],
  withMenu: false,
  optionsMenu: [],
  count: 0,
  rowsPerPage: 10,
  page: 0,
  onPageChanged: () => {},
  showPagination: true,
  isClickable: false,
  onRowClicked: () => {},
  showHead: true,
};

export default TableComponent;
