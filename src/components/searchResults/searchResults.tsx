import { Link } from 'react-router-dom';
import './searchResults.module.scss';

const SearchResults = ({ results, setShowSearchResult }: { results: any; setShowSearchResult: any }) => {
  const handleSearchClick = () => setShowSearchResult(false);
  return (
    <div className="search-results-list" aria-labelledby="search">
      {results.map((result: any) => (
        <Link key={result.key} to={result.hash}>
          <div role="presentation" className="search-result" onClick={handleSearchClick} onKeyDown={handleSearchClick}>
            <div className="result-details-container">
              <span className="result-hash">{result.key}</span>
              <div className="navsearchresult">
                <span className="result-name">{result.name}</span>
                <span className="result-type">{result.type}</span>
              </div>
            </div>
            {/* <div className="result-type-container">
            <span className="result-type">{result.type}</span>
          </div> */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
