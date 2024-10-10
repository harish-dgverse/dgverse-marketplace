import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FC } from 'react';
import './filter.module.scss';

interface FilterProps {
  applyFilterData: any;
  setFilterOptionState: any;
  filterOptionState: any;
  clearFilterData: any;
  filterOptions: any;
}

const Filter: FC<FilterProps> = ({
  filterOptionState,
  setFilterOptionState,
  applyFilterData,
  clearFilterData,
  filterOptions,
}) => {
  const handleFilterInputChange = (e: any) => {
    const [section, subOption] = e.target.name.split('.');
    const sectionState = {
      ...filterOptionState[section],
      [subOption]: e.target.checked,
    };
    setFilterOptionState({
      ...filterOptionState,
      [section]: sectionState,
    });
  };

  return (
    <Grid className="filtercheck" xs={12}>
      <div className="filtersec">
        <div className="applysec">
          <span className="filtertitle">Filters</span>
          <div className="btnsection">
            <div className="apply">
              <Button className="applybtn" variant="outlined" onClick={applyFilterData}>
                Apply
              </Button>
            </div>
            <div className="cancel">
              <Button className="applybtn" variant="outlined" onClick={clearFilterData}>
                Clear
              </Button>
            </div>
          </div>
        </div>
        {filterOptions.map((filterItem: any) => (
          <div key={filterItem.sectionHeader.key} className="checkboxsec">
            <span className="filterclass-header">{filterItem.sectionHeader.label}</span>
            <FormGroup>
              {filterItem.options.map((option: any) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      name={`${filterItem.sectionHeader.value}.${option.value}`}
                      data-cy={`${filterItem.sectionHeader.value}.${option.value}`}
                      checked={filterOptionState[filterItem.sectionHeader.value][option.value]}
                      onChange={handleFilterInputChange}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </div>
        ))}
      </div>
    </Grid>
  );
};
export default Filter;
