import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {
  FormControl,
  TextField,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  withStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormLabel,
  FormHelperText
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Translate from '../../common/Translate';
import InternationalizedLink from '../../common/InternationalizedLink';
import { wikiBBSLinks } from '../../../conf/externalLinks';
import SearchBottomActionButtons from './SearchBottomActionButtons';
import styles from './styles';
import SliderForm from './SliderForm';
import { idNameTypeExtended } from '../../../types/idName.type';

const SUBJECT_NAME_MAX_LENGTH = 80;

class DocumentSearch extends React.Component {
  /*
    The state is created with particular key names
    because these names are directly linked to
    the names of these properties in Elasticsearch. Here we have a syntax that
    allow us to distinguish search range parameters from others parameters.
  */
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleValueChange = this.handleValueChange.bind(this);
    this.getSubjectObjFromCode = this.getSubjectObjFromCode.bind(this);
    props.getAllDocumentTypes();
    props.getAllSubjects();
  }

  getInitialState() {
    const { publicationDateMinValue, publicationDateMaxValue } = this.props;

    return {
      'date_publication-range': {
        isEditable: false,
        min: publicationDateMinValue,
        max: publicationDateMaxValue
      },
      authors: '',
      'contributor nickname': '',
      description: '',
      publication_other_bbs_old: '',
      iso_regions: '',
      countries: '',
      id_db_import: '',
      subjects: '',
      title: '',
      'type name': '',
      matchAllFields: true,
      allFieldsRequest: '',
      panelExpanded: 'specific-fields-panel'
    };
  }

  getSubjectObjFromCode = code => {
    const { allSubjects } = this.props;
    return allSubjects.find(t => t.code === code);
  };

  /**
   * @param {string} keyName
   * @param {Event} event
   * This function changes the state of the keyName property
   * with the value of the target event.
   */
  handleValueChange = (keyName, event) => {
    this.setState({
      [keyName]: event.target.value
    });
  };

  /**
   * This function set the state of the keyname property
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
   * This function set the state of the keyname property
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

  /**
   * Change search panels state (expanded or not)
   */
  handlePanelSelected = panel => (event, isExpanded) => {
    this.setState({
      panelExpanded: isExpanded ? panel : ''
    });
  };

  resetToInitialState = () => {
    const initialState = this.getInitialState();
    // Don't reset the expanded panel
    delete initialState.panelExpanded;
    this.setState(initialState);
  };

  getTranslatedAndFormattedSubject = subject => {
    const { intl } = this.props;
    let formattedSubject = '';
    const hasParentSubject = subject.parent !== null;
    formattedSubject += hasParentSubject ? '\u00a0\u00a0\u00a0\u00a0' : ''; // indentation of sub-subject
    formattedSubject += `${subject.code} - `;
    const translatedSubject = intl.formatMessage({
      id: subject.code,
      defaultMessage: subject.subject
    });

    formattedSubject +=
      translatedSubject.length > SUBJECT_NAME_MAX_LENGTH
        ? `${translatedSubject.substring(0, SUBJECT_NAME_MAX_LENGTH)}…`
        : translatedSubject;

    return hasParentSubject ? formattedSubject : <b>{formattedSubject}</b>;
  };

  render() {
    const {
      classes,
      resourceType,
      resetResults,
      startAdvancedsearch,
      publicationDateMinValue,
      publicationDateMaxValue,
      allDocumentTypes,
      allSubjects,
      intl
    } = this.props;

    const {
      'date_publication-range': publicationDateRange,
      id_db_import, // eslint-disable-line camelcase
      title,
      authors,
      'contributor nickname': contributorNickname,
      description: abstract,
      'type name': documentTypeName,
      subjects, // TODO: currently, we select only one subject via a dropdown menu. It should be possible to search multiple subjects.
      iso_regions, // eslint-disable-line camelcase
      countries,
      publication_other_bbs_old, // eslint-disable-line camelcase
      matchAllFields,
      allFieldsRequest,
      panelExpanded
    } = this.state;

    return (
      <>
        <Typography
          variant="body1"
          gutterBottom
          paragraph
          style={{ fontStyle: 'italic', textAlign: 'center' }}>
          <Translate>
            The BBS (&quot;Bulletin Bibliographique Spéléologique&quot; in
            french) is an annual review of the worldwide speleological
            litterature.
          </Translate>
          <br />
          <InternationalizedLink links={wikiBBSLinks}>
            <Translate>
              You can find more info about the BBS on the dedicated
              Grottocenter-wiki page.
            </Translate>
          </InternationalizedLink>
        </Typography>

        <Accordion
          expanded={panelExpanded === 'specific-fields-panel'}
          onChange={this.handlePanelSelected('specific-fields-panel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="specific-fields"
            id="specific-fields">
            <Typography variant="h6">
              <Translate>Search on specific fields</Translate>
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={event => {
                event.preventDefault();

                // We don't want to use allFieldsRequest for the search
                const stateToSearch = { ...this.state };
                delete stateToSearch.allFieldsRequest;
                delete stateToSearch.panelExpanded;

                // Get subject from id
                const subjectObj = this.getSubjectObjFromCode(
                  stateToSearch[subjects]
                );
                stateToSearch[subjects] = subjectObj ? subjectObj.subject : '';
                startAdvancedsearch(stateToSearch, resourceType);
              }}
              className={classes.formContainer}>
              <div
                className={classes.formPartContainer}
                style={{ justifyContent: 'flex-start' }}>
                <fieldset className={classes.fieldset}>
                  <legend className={classes.legend}>
                    <Translate>Content</Translate>
                  </legend>

                  <div className={classes.formPartContainer}>
                    <TextField
                      className={classes.formElement}
                      label={
                        <span>
                          <Translate>Title</Translate>
                        </span>
                      }
                      onChange={event => this.handleValueChange('title', event)}
                      value={title}
                      InputProps={{
                        classes: {
                          input: classes.formElementFontSize
                        }
                      }}
                    />

                    <TextField
                      className={classes.formElement}
                      label={
                        <span>
                          <Translate>Abstract</Translate>
                        </span>
                      }
                      onChange={event =>
                        this.handleValueChange('description', event)
                      }
                      value={abstract}
                    />

                    <FormControl className={classes.formElement}>
                      <InputLabel htmlFor="subjects">
                        <Translate>Subjects</Translate>
                      </InputLabel>
                      <Select
                        value={subjects}
                        onChange={event =>
                          this.handleValueChange('subjects', event)
                        }
                        inputProps={{
                          id: 'code',
                          name: 'subject'
                        }}>
                        <MenuItem key={-1} value="">
                          <i>
                            <Translate>All subjects</Translate>
                          </i>
                        </MenuItem>
                        {allSubjects.map(subject => (
                          <MenuItem key={subject.code} value={subject.code}>
                            {this.getTranslatedAndFormattedSubject(subject)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formElement}>
                      <InputLabel htmlFor="documentType">
                        <Translate>Document type</Translate>
                      </InputLabel>
                      <Select
                        value={documentTypeName}
                        onChange={event =>
                          this.handleValueChange('type name', event)
                        }
                        inputProps={{
                          id: 'id',
                          name: 'name'
                        }}>
                        <MenuItem key={-1} value="">
                          <i>
                            <Translate>All document types</Translate>
                          </i>
                        </MenuItem>
                        {allDocumentTypes
                          .filter(dt => dt.isAvailable)
                          .map(docType => (
                            <MenuItem key={docType.id} value={docType.name}>
                              <Translate>{docType.name}</Translate>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </fieldset>
                <fieldset className={classes.fieldset}>
                  <legend className={classes.legend}>
                    <Translate>Attributes</Translate>
                  </legend>
                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>Contributor nickname</Translate>
                      </span>
                    }
                    onChange={event =>
                      this.handleValueChange('contributor nickname', event)
                    }
                    value={contributorNickname}
                  />

                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>Authors</Translate>
                      </span>
                    }
                    onChange={event => this.handleValueChange('authors', event)}
                    value={authors}
                  />

                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>Publication</Translate>
                      </span>
                    }
                    onChange={event =>
                      this.handleValueChange('publication_other_bbs_old', event)
                    }
                    value={publication_other_bbs_old} // eslint-disable-line camelcase
                  />

                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>ISO Countries</Translate>
                      </span>
                    }
                    onChange={event =>
                      this.handleValueChange('countries', event)
                    }
                    value={countries}
                    helperText={<Translate>Apha 2 format (eg: FR)</Translate>}
                  />

                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>ISO Regions</Translate>
                      </span>
                    }
                    onChange={event =>
                      this.handleValueChange('iso_regions', event)
                    }
                    value={iso_regions} // eslint-disable-line camelcase
                    helperText={
                      <Translate>ISO 3166-2 codes (eg: FR-OCC)</Translate>
                    }
                  />

                  <TextField
                    className={classes.formElement}
                    label={
                      <span>
                        <Translate>Source id</Translate>
                      </span>
                    }
                    onChange={event =>
                      this.handleValueChange('id_db_import', event)
                    }
                    value={id_db_import} // eslint-disable-line camelcase
                    helperText={
                      <Translate>
                        Original id from an imported database
                      </Translate>
                    }
                  />
                  <SliderForm
                    label={intl.formatMessage({
                      id: 'Publication Date'
                    })}
                    disabled={!publicationDateRange.isEditable}
                    onDisable={this.handleCheckedChange(
                      'date_publication-range'
                    )}
                    min={publicationDateMinValue}
                    max={publicationDateMaxValue}
                    onChange={values => {
                      this.handleRangeChange(
                        'date_publication-range',
                        values,
                        publicationDateMinValue,
                        publicationDateMaxValue
                      );
                    }}
                    value={[publicationDateRange.min, publicationDateRange.max]}
                  />
                </fieldset>
              </div>

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
                      Specify if the search results must match all the fields
                      you typed above (default is yes).
                    </Translate>
                  </FormHelperText>
                </FormControl>
              </div>

              <SearchBottomActionButtons
                resetResults={resetResults}
                resetParentState={this.resetToInitialState}
              />
            </form>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={panelExpanded === 'all-fields-panel'}
          onChange={this.handlePanelSelected('all-fields-panel')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="all-fields-search-content"
            id="all-fields-search-content">
            <Typography variant="h6">
              <Translate>Search on all fields</Translate>
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
            <Typography variant="body1" gutterBottom paragraph>
              <i>
                <Translate>
                  Perform an advanced search on all the fields. Results
                  displayed will have at least one field matching your request.
                </Translate>
              </i>
            </Typography>
            <form
              noValidate
              autoComplete="off"
              onSubmit={event => {
                event.preventDefault();

                // We don't want to use allFieldsRequest for the search
                const stateToSearch = this.getInitialState();
                delete stateToSearch.allFieldsRequest;
                delete stateToSearch.panelExpanded;

                // Fill state with same request
                stateToSearch.matchAllFields = false;
                stateToSearch.id_db_import = allFieldsRequest;
                stateToSearch.title = allFieldsRequest;
                stateToSearch.authors = allFieldsRequest;
                stateToSearch.description = allFieldsRequest;
                stateToSearch.subjects = allFieldsRequest;
                stateToSearch.iso_regions = allFieldsRequest;
                stateToSearch.countries = allFieldsRequest;
                stateToSearch.publication_other_bbs_old = allFieldsRequest;

                startAdvancedsearch(stateToSearch, resourceType);
              }}
              className={classes.formContainer}>
              <div
                className={classes.formPartContainer}
                style={{ justifyContent: 'flex-start' }}>
                <TextField
                  className={classes.formElement}
                  label={
                    <span>
                      <Translate>All fields request</Translate>
                    </span>
                  }
                  onChange={event =>
                    this.handleValueChange('allFieldsRequest', event)
                  }
                  value={allFieldsRequest}
                />
              </div>

              <SearchBottomActionButtons
                resetResults={resetResults}
                resetParentState={this.resetToInitialState}
              />
            </form>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }
}

DocumentSearch.propTypes = {
  classes: PropTypes.shape({
    formLabel: PropTypes.string,
    formElementFontSize: PropTypes.string,
    formPartContainer: PropTypes.string,
    formContainer: PropTypes.string,
    formElement: PropTypes.string,
    fieldset: PropTypes.string,
    legend: PropTypes.string
  }).isRequired,
  startAdvancedsearch: PropTypes.func.isRequired,
  resetResults: PropTypes.func.isRequired,
  resourceType: PropTypes.string.isRequired,
  getAllSubjects: PropTypes.func.isRequired,
  allSubjects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getAllDocumentTypes: PropTypes.func.isRequired,
  allDocumentTypes: PropTypes.arrayOf(
    idNameTypeExtended({
      isAvailable: PropTypes.bool.isRequired
    })
  ).isRequired,
  publicationDateMinValue: PropTypes.number,
  publicationDateMaxValue: PropTypes.number,

  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired
};

DocumentSearch.defaultProps = {
  publicationDateMinValue: 1800,
  publicationDateMaxValue: new Date().getFullYear()
};

export default injectIntl(withStyles(styles)(DocumentSearch));
