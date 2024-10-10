/* eslint-disable react/no-array-index-key */
import { IconButton, MenuItem, Select, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { FC, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import './dynamicKeyPairForm.scss';

interface DynamicKeyPairFormOptionsProps {
  firstFieldDropdown?: boolean;
  firstFieldDropdownInitialState?: any;
  firstFieldDropdownState?: any;
  firstFieldDropdownSetState?: any;
  secondFieldDropdown?: boolean;
  secondFieldDropdownInitialState?: any;
  secondFieldDropdownState?: any;
  secondFieldDropdownSetState?: any;
  componentState?: any;
  componentSetState?: any;
  // [key:string]: string;
}

interface DynamicKeyPairFormProps {
  formValues: any;
  setFormValues: any;
  maxFields?: number;
  options: DynamicKeyPairFormOptionsProps;
}

const DynamicKeyPairForm: FC<DynamicKeyPairFormProps> = ({ formValues, setFormValues, maxFields, options }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { firstFieldDropdown, firstFieldDropdownInitialState, firstFieldDropdownState, firstFieldDropdownSetState } =
    options;
  const defaultState = { attribute: '', value: '' };
  const [dropdownPrevValue, setDropdownPrevValue] = useState('');
  const handleChange = (i: number, e: any) => {
    const newFormValues = [...formValues];
    // eslint-disable-next-line prettier/prettier
    newFormValues[i][e.target.name as keyof typeof newFormValues[typeof i]] = e.target.value;
    if (firstFieldDropdown && e.target.name === 'attribute') {
      const newSocialMediaState = [...firstFieldDropdownState];
      if (dropdownPrevValue) {
        const prevIndex = firstFieldDropdownInitialState.findIndex((item: any) => item.text === dropdownPrevValue);
        if (prevIndex !== -1) newSocialMediaState[prevIndex].disabled = false;
      }
      const index = firstFieldDropdownInitialState.findIndex((item: any) => item.value === e.target.value);
      newSocialMediaState[index].disabled = true;
      firstFieldDropdownSetState(newSocialMediaState);
    }
    setFormValues(newFormValues);
  };

  useEffect(() => {
    setFormValues([defaultState]);
  }, []);

  const addFormFields = () => {
    const formValueLength = formValues.length;
    if (formValueLength === maxFields) {
      enqueueSnackbar(`Maximum limit reached`, { variant: 'info' });
      return;
    }
    if (!(!!formValues[formValueLength - 1].attribute && !!formValues[formValueLength - 1].value)) {
      enqueueSnackbar(`Both atribute and value have data`, { variant: 'info' });
      return;
    }
    setFormValues([...formValues, defaultState]);
  };

  const removeFormFields = (i: any) => {
    const newFormValues = [...formValues];
    const [removedElement] = newFormValues.splice(i, 1);
    if (firstFieldDropdown) {
      const newSocialMediaState = [...firstFieldDropdownState];
      if (newFormValues.length === 0) firstFieldDropdownSetState(firstFieldDropdownInitialState);
      else {
        const index = newSocialMediaState.findIndex((item: any) => item.value === removedElement?.attribute);
        if (index !== -1) {
          newSocialMediaState[index].disabled = false;
          firstFieldDropdownSetState(newSocialMediaState);
        }
      }
    }
    if (newFormValues.length === 0) setFormValues([defaultState]);
    else setFormValues(newFormValues);
  };

  const handleOnFocus = (e: any) => {
    setDropdownPrevValue(e.target.innerText);
  };
  return (
    <div>
      {formValues.map((element: any, index: any) => (
        <div className="form-inline" key={`key${index}`}>
          {firstFieldDropdown && (
            <Select
              className="additional-fields"
              name="attribute"
              data-cy="input-dynamic-key-pair-key-select"
              id="social-media-add-dropdown"
              value={element.attribute || ''}
              key={`select${element.attribute}`}
              onChange={(e) => handleChange(index, e)}
              onFocus={(e) => handleOnFocus(e)}
            >
              {firstFieldDropdownState.map((item: any) => (
                <MenuItem value={item?.value} disabled={item?.disabled} key={item?.value}>
                  <span className="dropdown-menu">{item?.text}</span>
                </MenuItem>
              ))}
            </Select>
          )}
          {!firstFieldDropdown && (
            <TextField
              className="additional-fields"
              data-cy="input-dynamic-key-pair-key"
              name="attribute"
              key={`attrtext${index}`}
              value={element.attribute || ''}
              variant="outlined"
              onChange={(e) => handleChange(index, e)}
            />
          )}
          <TextField
            className="additional-fields"
            data-cy="input-dynamic-key-pair-value"
            name="value"
            key={`valuetext${index}`}
            value={element.value || ''}
            variant="outlined"
            onChange={(e) => handleChange(index, e)}
          />
          <IconButton
            className="additional-field-control-button"
            aria-label="clear or delete field"
            onClick={() => removeFormFields(index)}
          >
            <ClearIcon />
          </IconButton>
          <IconButton
            className="additional-field-control-button"
            aria-label="add field"
            data-cy="add-social-data-next-column"
            onClick={addFormFields}
          >
            <AddIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default DynamicKeyPairForm;
