import React from 'react';
import PropTypes from 'prop-types';
import { includes, filter, pipe, pluck, join } from 'ramda';
import {
  Tooltip,
  FormControl,
  Input,
  ListItemText,
  Select,
  Checkbox,
  MenuItem
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useIntl } from 'react-intl';

import { PropertyWrapper } from '../../common/Properties/Property';
import { detailsType as entranceDetailsType } from '../Entry/Provider';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const isSelected = selection => n => includes(n.id, selection);

const getEntrancesName = selection =>
  pipe(filter(isSelected(selection)), pluck('name'), join(', '));

const EntrancesSelection = ({
  loading = false,
  entrances,
  onSelect,
  selection
}) => {
  const { formatMessage } = useIntl();

  const handleChange = event => {
    onSelect(event.target.value);
  };
  return (
    <PropertyWrapper>
      <VisibilityIcon fontSize="large" color="primary" />
      <Tooltip title={formatMessage({ id: 'Network entrances' })}>
        {loading ? (
          <Skeleton variant="text" width="100%" />
        ) : (
          <FormControl fullWidth>
            <Select
              displayEmpty
              multiple
              value={selection}
              onChange={handleChange}
              input={<Input />}
              renderValue={selected => {
                if (selected.length === 0) {
                  return <em>{formatMessage({ id: 'Network entrances' })}</em>;
                }
                return getEntrancesName(selected)(entrances);
              }}
              MenuProps={MenuProps}>
              <MenuItem disabled value="">
                <em>{formatMessage({ id: 'Network entrances' })}</em>
              </MenuItem>
              {entrances.map(({ name, id }) => (
                <MenuItem key={name} value={id}>
                  <Checkbox checked={includes(id, selection)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Tooltip>
    </PropertyWrapper>
  );
};

EntrancesSelection.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selection: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool,
  entrances: PropTypes.arrayOf(entranceDetailsType)
};

export default EntrancesSelection;
