import React, { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

interface tableProps {
  rows: any;
  columns: any;
  selected?: any;
  setSelected?: any;
  skipColumnHeads?: boolean;
}

const DataTable: FC<tableProps> = ({ rows, columns, selected, setSelected, skipColumnHeads = false }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (identifier: number) => selected.indexOf(identifier) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, identifier: number) => {
    const selectedIndex = selected.indexOf(identifier);
    const newSelected = [];
    if (selectedIndex === -1) {
      newSelected.push(identifier);
    }
    console.log(newSelected);
    setSelected(newSelected);
  };

  return (
    <TableContainer data-cy="data-table">
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        {!skipColumnHeads && (
          <TableHead>
            <TableRow key="table-head-row">
              {columns.map((item: any) => (
                <TableCell key={`table-head-${item.label}`}>{item.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row: any) => {
            let isItemSelected;
            if (selected) isItemSelected = isSelected(row.identifier);
            return (
              <TableRow
                className="data-table-row"
                key={`key-${row.identifier}`}
                hover
                tabIndex={-1}
                aria-checked={!!selected && isItemSelected}
                onClick={selected ? (event) => handleClick(event, row.identifier) : undefined}
                selected={!!selected && isItemSelected}
              >
                {columns.map((x: any) => {
                  return (
                    <TableCell key={`table-body-${row[x.key]}-${row.nftId}`} scope="row">
                      {x.hyperlink ? (
                        <a
                          href={x.hyperlink.link.replace(x.hyperlink.replacer, row[x.hyperlink.key])}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {row[x.key]}
                        </a>
                      ) : (
                        row[x.key]
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
