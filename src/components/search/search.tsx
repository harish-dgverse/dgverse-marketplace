/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Paper from '@mui/material/Paper';
import { InputBase, FormControl, IconButton, CircularProgress, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../../api/axios';
import './search.module.scss';

const Search = ({
  setResults,
  setShowSearchResult,
  setSearchLoading,
  searchLoading,
}: {
  setResults: any;
  setShowSearchResult: any;
  setSearchLoading: any;
  searchLoading: any;
}) => {
  const [input, setInput] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    if (!input) {
      setSearchLoading(false);
      setShowSearchResult(false);
      setResults([]);
    }
  }, [input]);

  const fetchData = (queryValue: any) => {
    setSearchLoading(true);
    axios
      .get(`/v1/analytics/search?q=${queryValue}`)
      .then((response) => response.data)
      .then((json) => {
        setResults(json);
        setSearchLoading(false);
        setShowSearchResult(true);
      })
      .catch(() => {
        setSearchLoading(false);
      });
  };

  const handleChange = (queryValue: any) => {
    setInput(queryValue);
    const prohibitedValuesToSearch = ['0.0.'];
    if (queryValue && queryValue.length > 3 && !prohibitedValuesToSearch.includes(queryValue)) {
      fetchData(queryValue);
    } else {
      setResults([]);
      setSearchLoading(false);
    }
  };

  const handleClose = () => {
    setShowSearchResult(false);
  };

  const handleOpen = () => {
    setShowSearchResult(true);
  };

  useEffect(() => {
    const element: any = ref?.current || null;
    if (element) {
      element.addEventListener(
        'submit',
        function (e: any) {
          e.preventDefault();
        },
        false
      );
    }
  }, []);

  return (
    <div className="input-wrapper">
      <Paper className="searchbox" component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        {/* <FormControl onSubmit={(e) => e.preventDefault()}> */}
        <form className="searchForm" ref={ref}>
          <InputBase
            className="search-home"
            sx={{ ml: 1, flex: 1 }}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            // onBlur={handleClose}
            onFocus={(e) => handleChange(e.target.value)}
            placeholder="Search"
            inputProps={{
              'aria-label': 'search',
            }}
          />
        </form>
        {searchLoading && (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Search;
