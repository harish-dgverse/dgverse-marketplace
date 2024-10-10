import { Button, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import './feedback.scss';
import { contactUsMail } from '../../services/miscServices';
import { formatValidationErrors } from '../../utils/helpers/validateFormData';
import { fieldValidations } from '../../utils/const/formValidation/feedback';

interface FeedbackInitialStateType {
  name: string;
  email: string;
  comments: string;
}

const Feedback = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const errors: { fieldName: string; validation: string }[] = [];
  const feedbackInitialState: FeedbackInitialStateType = {
    name: '',
    email: '',
    comments: '',
  };
  const [feedbackState, setFeedbackState] = useState(feedbackInitialState);

  const handleInputChange = (ev: any) => {
    setFeedbackState({
      ...feedbackState,
      [ev.target.name]: ev.target.value,
    });
  };

  const successOperation = () => {
    enqueueSnackbar('Our team will contact you soon.', { variant: 'success' });
    setFeedbackState(feedbackInitialState);
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
        if (validationCondition.type === 'required' && !feedbackState[fieldName as keyof FeedbackInitialStateType]) {
          errors.push({ fieldName: label, validation: validationCondition.type });
        } else if (validationCondition.type === 'email' && feedbackState[fieldName as keyof FeedbackInitialStateType]) {
          const fieldValue = feedbackState[fieldName as keyof FeedbackInitialStateType];
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
    if (feedbackState.name === '') {
      enqueueSnackbar(`Please fill in all fields that are marked as required`, { variant: 'error' });
      return;
    }

    const payload = { ...feedbackState };
    mutate(payload);
  };

  return (
    <div className="feedback-outer-container">
      <div className="leftview" />
      <section className="feedback-container mint-nft-container">
        <span className="page-header">Feedback Form</span>
        <p className="form-info">All fields marked with * are required</p>
        <div className="feedback-fields-container mint-nft-fields-container">
          <Grid container>
            <Grid xs={12} sm={6}>
              Name:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-basic"
                  name="name"
                  data-cy="feedback-name"
                  onChange={handleInputChange}
                  value={feedbackState.name}
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
                  data-cy="feedback-mail"
                  onChange={handleInputChange}
                  value={feedbackState.email}
                  variant="outlined"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6}>
              Comments:<sup>*</sup>
            </Grid>
            <Grid xs={12} sm={6}>
              <div className="inputfield">
                <TextField
                  id="outlined-textarea textarea-box"
                  className="feedback-comments"
                  name="comments"
                  data-cy="description-create"
                  onChange={handleInputChange}
                  value={feedbackState.comments}
                  multiline
                  rows={4}
                  maxRows={4}
                />
              </div>
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

export default Feedback;
