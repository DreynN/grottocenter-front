import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';

import {
  FormControl,
  TextField,
  Switch,
  Typography,
  FormLabel,
  FormHelperText
} from '@material-ui/core';

import SliderForm from './SliderForm';
import Translate from '../../common/Translate';
import SearchBottomActionButtons from './SearchBottomActionButtons';
import styles from './styles';

class OrganizationsSearch extends React.Component {
  // TODO: Handle the max of number of cavers dynamically

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
  }

  getInitialState() {
    const { numberOfCaversMinValue, numberOfCaversMaxValue } = this.props;

    return {
      'nb cavers-range': {
        isEditable: false,
        min: numberOfCaversMinValue,
        max: numberOfCaversMaxValue
      },
      city: '',
      county: '',
      country: '',
      name: '',
      postal_code: '',
      region: '',
      matchAllFields: true
    };
  }

  /**
   * @param {string} keyName
   * @param {Event} event
   * Change the state of the keyName property
   * with the value of the target event.
   */
  handleValueChange = (keyName, event) => {
    this.setState({
      [keyName]: event.target.value
    });
  };

  /**
   * Set the state of the keyname property
   * to be the same value of the range.
   * If the values given are > to the minValueAuthorized
   * (same for < to maxValueAuthorized),
   * it set it to the min/maxValueAuthorized.
   */
  handleRangeChange = (
    keyName,
    values,
    minValueAuthorized,
    maxValueAuthorized
  ) => {
    const newState = {
      [keyName]: {
        ...this.state[keyName], // eslint-disable-line react/destructuring-assignment
        min: values[0] < minValueAuthorized ? minValueAuthorized : values[0],
        max: values[1] > maxValueAuthorized ? maxValueAuthorized : values[1]
      }
    };
    this.setState(newState);
  };

  /**
   * Set the state of the keyname property
   * to be the same value as the event of the slider.
   */
  handleCheckedChange = keyName => event => {
    const newState = {
      [keyName]: {
        ...this.state[keyName], // eslint-disable-line react/destructuring-assignment
        isEditable: event.target.checked
      }
    };
    this.setState(newState);
  };

  handleBooleanChange = keyName => event => {
    this.setState({
      [keyName]: event.target.checked
    });
  };

  resetToInitialState = () => {
    this.setState(this.getInitialState());
  };

  render() {
    const {
      classes,
      resourceType,
      resetResults,
      startAdvancedsearch,
      numberOfCaversMinValue,
      numberOfCaversMaxValue,
      intl
    } = this.props;

    const {
      'nb cavers-range': numberOfCaversRange,
      city,
      county,
      country,
      name,
      postal_code, // eslint-disable-line camelcase
      region,
      matchAllFields
    } = this.state;

    return (
      <form
        noValidate
        autoComplete="off"
        onSubmit={event => {
          event.preventDefault();
          startAdvancedsearch(this.state, resourceType);
        }}
        className={classes.formContainer}>
        <Typography variant="h6">
          <Translate>Organization properties</Translate>
        </Typography>
        <div
          className={classes.formPartContainer}
          style={{ justifyContent: 'flex-start' }}>
          <TextField
            className={classes.formElement}
            label={
              <span>
                <Translate>Organization name</Translate>
              </span>
            }
            onChange={event => this.handleValueChange('name', event)}
            value={name}
          />
          <SliderForm
            label={intl.formatMessage({
              id: 'Number of cavers'
            })}
            disabled={!numberOfCaversRange.isEditable}
            onDisable={this.handleCheckedChange('nb cavers-range')}
            min={numberOfCaversMinValue}
            max={numberOfCaversMaxValue}
            onChange={values => {
              this.handleRangeChange(
                'nb cavers-range',
                values,
                numberOfCaversMinValue,
                numberOfCaversMaxValue
              );
            }}
            value={[numberOfCaversRange.min, numberOfCaversRange.max]}
          />
        </div>

        <fieldset className={classes.fieldset}>
          <legend className={classes.legend}>
            <Translate>Localization</Translate>
          </legend>

          <div className={classes.formPartContainer}>
            <TextField
              className={classes.formElement}
              label={
                <span>
                  <Translate>City</Translate>
                </span>
              }
              onChange={event => this.handleValueChange('city', event)}
              value={city}
            />

            <TextField
              className={classes.formElement}
              label={
                <span>
                  <Translate>Postal code</Translate>
                </span>
              }
              onChange={event => this.handleValueChange('postal_code', event)}
              value={postal_code} // eslint-disable-line camelcase
            />

            <TextField
              className={classes.formElement}
              label={
                <span>
                  <Translate>County</Translate>
                </span>
              }
              onChange={event => this.handleValueChange('county', event)}
              value={county}
            />

            <TextField
              className={classes.formElement}
              label={
                <span>
                  <Translate>Region</Translate>
                </span>
              }
              onChange={event => this.handleValueChange('region', event)}
              value={region}
            />

            <TextField
              className={classes.formElement}
              label={
                <span>
                  <Translate>Country</Translate>
                </span>
              }
              onChange={event => this.handleValueChange('country', event)}
              value={country}
            />
          </div>
        </fieldset>

        <div
          className={classes.formPartContainer}
          style={{ justifyContent: 'flex-start' }}>
          <FormControl>
            <FormLabel className={classes.formLabel}>
              <span>
                <Translate>
                  {matchAllFields
                    ? 'Matching all fields'
                    : 'Matching at least one field'}
                </Translate>
              </span>
              <Switch
                checked={matchAllFields}
                onChange={this.handleBooleanChange('matchAllFields')}
                value={matchAllFields}
              />
            </FormLabel>
            <FormHelperText>
              <Translate>
                Specify if the search results must match all the fields you
                typed above (default is yes).
              </Translate>
            </FormHelperText>
          </FormControl>
        </div>

        <SearchBottomActionButtons
          resetResults={resetResults}
          resetParentState={this.resetToInitialState}
        />
      </form>
    );
  }
}

OrganizationsSearch.propTypes = {
  classes: PropTypes.shape({
    formContainer: PropTypes.string,
    formPartContainer: PropTypes.string,
    formElement: PropTypes.string,
    fieldset: PropTypes.string,
    legend: PropTypes.string,
    formLabel: PropTypes.string
  }).isRequired,
  startAdvancedsearch: PropTypes.func.isRequired,
  resetResults: PropTypes.func.isRequired,
  resourceType: PropTypes.string.isRequired,

  // Min / max values for form
  numberOfCaversMinValue: PropTypes.number,
  numberOfCaversMaxValue: PropTypes.number,

  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired
};

OrganizationsSearch.defaultProps = {
  numberOfCaversMinValue: 0,
  numberOfCaversMaxValue: 100
};

export default injectIntl(withStyles(styles)(OrganizationsSearch));
