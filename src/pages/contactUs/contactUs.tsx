import { Button, TextField, Select, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';
import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import './contactUs.scss';
import { contactUsMail } from '../../services/miscServices';
import { formatValidationErrors } from '../../utils/helpers/validateFormData';
import { fieldValidations } from '../../utils/const/formValidation/contactUs';

interface ContactUsProps {}
interface ContactUsInitialStateType {
  name: string;
  email: string;
  role: string;
  companyName: string;
  businessFunction?: string;
  otherRole?: string;
  reason: string;
  source: string;
}

const ContactUs: FC<ContactUsProps> = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const errors: { fieldName: string; validation: string }[] = [];
  const contactUsInitialState: ContactUsInitialStateType = {
    name: '',
    email: '',
    role: '',
    otherRole: '',
    companyName: '',
    businessFunction: '',
    reason: '',
    source: '',
  };
  const [contactUsState, setContactUsState] = useState(contactUsInitialState);

  const handleInputChange = (ev: any) => {
    setContactUsState({
      ...contactUsState,
      [ev.target.name]: ev.target.value,
    });
  };

  const successOperation = () => {
    enqueueSnackbar('Our team will contact you soon.', { variant: 'success' });
    setContactUsState(contactUsInitialState);
    navigate(`/`);
  };

  const { mutate, isLoading } = useMutation(contactUsMail, {
    onSuccess: (data: any) => {
      if (data.status === 200 || data.status === 201) {
        successOperation();
      } else if (data.status === 400) {
        enqueueSnackbar(`Bad User Input`, { variant: 'info' });
      }
    },
    onError: (err) => {
      enqueueSnackbar(`Error occured: ${err}`, { variant: 'error' });
    },
  });

  const handleCreate = async (ev: any) => {
    ev.preventDefault();
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    /* Validation start */
    fieldValidations.forEach(({ fieldName, label, validations }: any) => {
      validations.forEach((validationCondition: any) => {
        if (validationCondition.type === 'required' && !contactUsState[fieldName as keyof ContactUsInitialStateType]) {
          errors.push({ fieldName: label, validation: validationCondition.type });
        } else if (validationCondition.type === 'email' && contactUsState[fieldName as keyof ContactUsInitialStateType]) {
          const fieldValue = contactUsState[fieldName as keyof ContactUsInitialStateType];
          // eslint-disable-next-line no-debugger
          debugger;
          if (fieldValue && !emailRegex.test(fieldValue)) errors.push({ fieldName: label, validation: 'format_regex' });
        }
      });
    });
    if (errors.length > 0) {
      const formattedError = formatValidationErrors(errors);
      if (formattedError.required.length > 0)
        enqueueSnackbar(`${formattedError.required.join(', ')} are required fields.`, {
          variant: 'error',
        });
      if (formattedError.number.length > 0)
        enqueueSnackbar(`${formattedError.number.join(', ')} should have number values.`, {
          variant: 'error',
        });
      if (formattedError.format_regex.length > 0)
        enqueueSnackbar(`${formattedError.format_regex.join(', ')} is out of format.`, { variant: 'error' });
      return;
    }
    /* Validation end */
    if (contactUsState.name === '') {
      enqueueSnackbar(`Please fill in all fields that are marked as required`, { variant: 'error' });
      return;
    }

    const payload = { ...contactUsState };
    mutate(payload);
  };

  return (
    <div className="contact-us-outer-container">
      <div className="leftview" />
      <section className="contact-us-container mint-nft-container">
        <span className="page-header">Contact Us</span>
        <p className="form-info">All fields marked with * are required</p>
        <div className="contact-us-fields-container mint-nft-fields-container">
          <Grid container>
            <Grid xs={12} sm={6}>
              Name:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-basic"
                  name="name"
                  data-cy="contact-us-name"
                  onChange={handleInputChange}
                  value={contactUsState.name}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Work email:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-basic"
                  name="email"
                  data-cy="contact-us-mail"
                  onChange={handleInputChange}
                  value={contactUsState.email}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Role:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <Select className="contact-us-role" name="role" onChange={handleInputChange} value={contactUsState.role}>
                {['Brand', 'Investor', 'Advertiser', 'Web3 Builder', 'Artist', 'Game Publisher', 'Other'].map(
                  (item: any) => (
                    <MenuItem value={item} key={item}>
                      <span className="dropdown-menu">{item}</span>
                    </MenuItem>
                  )
                )}
              </Select>
              {contactUsState.role === 'Other' && (
                <div className="inputfield">
                  <TextField
                    id="outlined-basic"
                    name="otherRole"
                    data-cy="contact-us-company-name"
                    onChange={handleInputChange}
                    value={contactUsState.otherRole}
                    variant="outlined"
                  />
                </div>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Company Name:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-basic"
                  name="companyName"
                  data-cy="contact-us-company-name"
                  onChange={handleInputChange}
                  value={contactUsState.companyName}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Business Function:
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-basic"
                  name="businessFunction"
                  data-cy="contact-us-business-fn"
                  onChange={handleInputChange}
                  value={contactUsState.businessFunction}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Reason to get in touch:
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-textarea"
                  className="contact-us-reason"
                  name="reason"
                  data-cy="description-create"
                  onChange={handleInputChange}
                  value={contactUsState.reason}
                  multiline
                  maxRows={4}
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              How did you hear about us:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <Select className="contact-us-source" name="source" onChange={handleInputChange} value={contactUsState.source}>
                {['Social Media', 'Google/Search engine'].map((item: any) => (
                  <MenuItem value={item} key={item}>
                    <span className="dropdown-menu">{item}</span>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </div>
        <div className="send-to-marketplace-action-button">
          <Button className="discard-button">Cancel</Button>
          {isLoading ? (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          ) : (
            <Button className="create-button" disabled={isLoading} onClick={handleCreate}>
              Submit
            </Button>
          )}
        </div>
      </section>
      <div className="rightview" />
    </div>
  );
};

export default ContactUs;
