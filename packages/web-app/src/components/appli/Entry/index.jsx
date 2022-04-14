import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { isEmpty, isNil } from 'ramda';

import Provider, {
  commentsType,
  detailsType,
  EntryContext,
  descriptionsType,
  documentsType,
  historiesType,
  locationsType,
  riggingsType
} from './Provider';
import Layout from '../../common/Layouts/Fixed';
import FixedContent from '../../common/Layouts/Fixed/FixedContent';
import CustomIcon from '../../common/CustomIcon';
import EntryMap from './EntryMap';
import Properties from './Properties';
import Descriptions from './Descriptions';
import Locations from './Locations';
import Riggings from './Riggings';
import Comments from './Comments';
import Documents from './Documents';
import Histories from './Histories';

const EntryProperties = () => (
  <>
    <EntryMap />
    <Properties />
  </>
);

export const Entry = () => {
  const { formatMessage, formatDate } = useIntl();
  const {
    state: {
      details: { id, name, author, creationDate, lastEditor, editionDate },
      descriptions,
      documents,
      histories,
      locations,
      riggings,
      comments
    }
  } = useContext(EntryContext);

  const footer = `${formatMessage({ id: 'Created by' })}
        ${author.fullName} ${
    !isNil(creationDate) ? `(${formatDate(creationDate)})` : ''
  }
        ${
          !isNil(lastEditor) && !isNil(editionDate)
            ? ` - ${formatMessage({
                id: 'Last modification by'
              })} ${lastEditor} (
          ${formatDate(editionDate)})`
            : ''
        }`;

  return (
    <Layout
      fixedContent={
        <FixedContent
          title={name || ''}
          content={<EntryProperties />}
          footer={footer}
          icon={<CustomIcon type="entry" />}
        />
      }>
      <Locations locations={locations} entranceId={id} />
      {!isEmpty(descriptions) && <Descriptions descriptions={descriptions} />}
      {!isEmpty(riggings) && <Riggings riggings={riggings} />}
      {!isEmpty(documents) && <Documents documents={documents} />}
      {!isEmpty(histories) && <Histories histories={histories} />}
      {!isEmpty(comments) && <Comments comments={comments} />}
    </Layout>
  );
};

const HydratedEntry = ({ ...props }) => (
  <Provider {...props}>
    <Entry />
  </Provider>
);

Entry.propTypes = {};

HydratedEntry.propTypes = {
  details: detailsType.isRequired,
  comments: commentsType.isRequired,
  descriptions: descriptionsType.isRequired,
  documents: documentsType.isRequired,
  histories: historiesType.isRequired,
  locations: locationsType.isRequired,
  riggings: riggingsType.isRequired,
  loading: PropTypes.bool
};

export default HydratedEntry;
