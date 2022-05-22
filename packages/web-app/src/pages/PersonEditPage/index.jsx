import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { isNil } from 'ramda';
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
  Icon,
  Typography,
  CircularProgress,
  Box
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';

import Layout from '../../components/common/Layouts/Fixed/FixedContent';
import ActionButton from '../../components/common/ActionButton';
import Alert from '../../components/common/Alert';
import { useBoolean } from '../../hooks';

import PersonEditForm from './PersonForm';
import makeUserData from './transformer';
import { updateUser } from '../../actions/UpdateUser';
import { postChangePassword } from '../../actions/ChangePassword';
import { postChangeEmail } from '../../actions/ChangeEmail';
import Summary from './Summary';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

function getSteps() {
  return ['Edit your profile', 'Summary'];
}
const steps = getSteps();

function getStepContent(step, userValues, control, errors, watch) {
  switch (step) {
    case 0:
      return <PersonEditForm control={control} errors={errors} watch={watch} />;
    case 1:
      return <Summary control={control} defautValues={userValues} />;
    default:
      return 'Unknown step';
  }
}

let defautValues = {
  name: '',
  surname: '',
  nickname: '',
  email: '',
  emailConfirmation: '',
  password: '',
  passwordConfirmation: ''
};

const StyledActionButton = styled(ActionButton)`
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const PersonEditPage = ({ userValues }) => {
  defautValues = userValues || defautValues;
  const history = useHistory();
  const { formatMessage } = useIntl();
  const isValid = useBoolean();
  const {
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
    formState: { errors, isSubmitted, isSubmitting, isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      user: defautValues
    }
  });
  const { error: UserError, loading: UserLoading } = useSelector(
    state => state.updateUser
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const authState = useSelector(state => state.login);

  const handleNext = async () => {
    const result = await trigger(
      [
        'user.passwordConfirmation',
        'user.name',
        'user.surname',
        'user.nickname',
        'user.email',
        'user.emailConfirmation',
        'user.password',
        'user.passwordConfirmation'
      ],

      {
        shouldFocus: true
      }
    );
    isValid.true();

    if (result) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const onSubmit = async data => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);

    const User = makeUserData(data);

    dispatch(updateUser(User));

    if (data.user.email !== undefined && data.user.email !== '') {
      dispatch(postChangeEmail(data.user.email));
    }
    if (data.user.password !== undefined && data.user.password !== '') {
      dispatch(
        postChangePassword(data.user.password, authState.authTokenDecoded)
      );
    }
  };

  const handleReset = () => {
    reset({ user: defautValues });
    setActiveStep(0);
  };

  const handleFinish = () => {
    history.push(`/ui/persons/:${userValues.id}`);
  };

  return (
    <Layout
      title={formatMessage({ id: 'Edit your profile' })}
      footer=""
      content={
        isSubmitted && isNil(UserError) ? (
          <Box display="flex" justifyContent="center" flexDirection="column">
            {UserLoading && (
              <>
                <Typography>
                  {formatMessage({
                    id: 'Updating user...'
                  })}
                </Typography>
                <CircularProgress />
              </>
            )}
            {!UserLoading && isSubmitSuccessful && (
              <form>
                <Alert
                  severity="success"
                  title={formatMessage({
                    id: 'User successfully updated'
                  })}
                />
              </form>
            )}
            {!UserLoading && !isSubmitSuccessful && (
              <form>
                <Alert
                  severity="error"
                  title={formatMessage({
                    id: 'An error occurred when updating the user!'
                  })}
                />
              </form>
            )}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Stepper activeStep={activeStep}>
                {steps.map(label => {
                  const stepProps = {};
                  const labelProps = {};

                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              <div>
                {activeStep === steps.length ? (
                  <div>
                    <Typography className={classes.instructions}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button onClick={handleReset} className={classes.button}>
                      {formatMessage({ id: 'Reset' })}
                    </Button>
                    <Button onClick={handleFinish} className={classes.button}>
                      {formatMessage({ id: 'Finish' })}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Typography
                      component="div"
                      className={classes.instructions}>
                      {getStepContent(
                        activeStep,
                        defautValues,
                        control,
                        errors,
                        watch
                      )}
                    </Typography>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}>
                        Back
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <StyledActionButton
                          label={formatMessage({ id: 'Update' })}
                          loading={isSubmitting}
                          color="primary"
                          icon={<Icon>send</Icon>}
                          type="submit"
                        />
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          className={classes.button}>
                          {activeStep === steps.length - 1
                            ? formatMessage({ id: 'Finish' })
                            : formatMessage({ id: 'Next' })}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Box>
        )
      }
    />
  );
};

PersonEditPage.propTypes = {
  userValues: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    surname: PropTypes.string,
    nickname: PropTypes.string
  })
};

export default PersonEditPage;
