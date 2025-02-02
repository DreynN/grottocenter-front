import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { Button, Divider, List, Tooltip } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import ScrollableContent from '../../../common/Layouts/Fixed/ScrollableContent';
import { locationsType } from '../Provider';
import Location from './Location';
import CreateLocationForm from '../../Form/LocationForm';
import { postLocation } from '../../../../actions/Location/CreateLocation';
import { usePermissions } from '../../../../hooks';
import Alert from '../../../common/Alert';

const Locations = ({ entranceId, locations, isSensitive }) => {
  const { formatMessage } = useIntl();
  const permissions = usePermissions();
  const dispatch = useDispatch();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const onSubmitForm = data => {
    dispatch(
      postLocation({
        entrance: entranceId,
        title: data.title,
        body: data.body,
        language: data.language.id
      })
    );
    setIsFormVisible(false);
  };

  return (
    <ScrollableContent
      dense
      title={formatMessage({ id: 'Location' })}
      icon={
        permissions.isAuth && (
          <Tooltip
            title={
              isFormVisible
                ? formatMessage({ id: 'Cancel adding a new location' })
                : formatMessage({ id: 'Add a new location' })
            }>
            <Button
              color={isFormVisible ? '' : 'secondary'}
              variant="outlined"
              onClick={() => setIsFormVisible(!isFormVisible)}
              startIcon={isFormVisible ? <CancelIcon /> : <AddCircleIcon />}>
              {formatMessage({ id: isFormVisible ? 'Cancel' : 'New' })}
            </Button>
          </Tooltip>
        )
      }
      content={
        <>
          {isFormVisible && (
            <>
              <CreateLocationForm isNewLocation onSubmit={onSubmitForm} />
              <Divider />
            </>
          )}

          {locations.length > 0 ? (
            <List dense disablePadding>
              {locations.map(location => (
                <React.Fragment key={location.id}>
                  <Location location={location} />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert
              severity={isSensitive ? 'warning' : 'info'}
              content={formatMessage({
                id: isSensitive
                  ? 'This entrance has a restricted access, you can not see its locations.'
                  : 'There is currently no location for this entrance.'
              })}
            />
          )}
        </>
      }
    />
  );
};

Locations.propTypes = {
  entranceId: PropTypes.number.isRequired,
  locations: locationsType,
  isSensitive: PropTypes.bool
};

export default Locations;
