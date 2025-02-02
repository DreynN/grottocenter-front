/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'ramda';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  deleteDuplicates,
  fetchDuplicatesList
} from '../../../actions/DuplicatesImport';
import { createColumns } from '../../common/Table/TableHead';
import Table from '../../common/Table';
import useMakeCustomHeaderCellRenders from './customHeaderCellRender';
import useMakeCustomCellRenders from './customCellRender';
import TableActions from './TableActions';
import { resetApiMessages } from '../../../actions/Document/ResetApiMessages';
import { resetEntranceState } from '../../../actions/Entrance/ResetEntrance';

const Wrapper = styled.div`
  margin-top: 10px;
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`;

const DuplicatesList = ({
  duplicateType,
  selectedDuplicates,
  setSelectedDuplicates,
  nextStep
}) => {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [order, setOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('dateInscription');
  const { loading, duplicatesList, latestHttpCodeOnDelete } = useSelector(
    state => state.duplicatesImport
  );
  const { latestHttpCode: httpCodeEntry } = useSelector(
    state => state.entrance
  );

  const { latestHttpCode: httpCodeDocument } = useSelector(
    state => state.createDocument
  );

  const makeTranslation = id =>
    formatMessage({ id: `${id[0].toUpperCase()}${id.slice(1)}` });
  const [columns, setColumns] = useState(
    createColumns(duplicatesList, makeTranslation)
  );
  const [hiddenColumns, setHiddenColumns] = useState(['id']);
  const customCell = useMakeCustomCellRenders();
  const customHeader = useMakeCustomHeaderCellRenders();

  const dispatch = useDispatch();

  const deleteSelected = () => {
    dispatch(deleteDuplicates(selectedDuplicates, duplicateType));
  };

  useEffect(() => {
    setColumns(createColumns(duplicatesList, makeTranslation));
  }, [duplicatesList]);

  useEffect(() => {
    if ([200, 204].includes(latestHttpCodeOnDelete)) {
      const criteria = {
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sortBy,
        orderBy: order
      };
      dispatch(fetchDuplicatesList(duplicateType, criteria));
    }
  }, [latestHttpCodeOnDelete]);

  useEffect(() => {
    dispatch(resetEntranceState());
    dispatch(resetApiMessages());
  }, [httpCodeEntry, httpCodeDocument]);

  useEffect(() => {
    const criteria = {
      limit: rowsPerPage,
      skip: page * rowsPerPage,
      sortBy,
      orderBy: order
    };
    dispatch(fetchDuplicatesList(duplicateType, criteria));
  }, [rowsPerPage, page, order, sortBy, duplicateType]);

  return (
    <>
      <Wrapper>
        <Table
          currentPage={page}
          columns={columns}
          customCellRenders={customCell}
          customHeaderCellRenders={customHeader}
          data={duplicatesList || []}
          hiddenColumns={hiddenColumns}
          loading={loading}
          openDetailedView={undefined}
          order={order}
          orderBy={sortBy || undefined}
          rowsCount={duplicatesList.length}
          rowsPerPage={rowsPerPage}
          selection={selectedDuplicates}
          title={formatMessage({ id: 'Duplicates list' })}
          updateCurrentPage={setPage}
          updateHiddenColumns={setHiddenColumns}
          updateOrder={setOrder}
          updateOrderBy={setSortBy}
          updateRowsPerPage={setRowsPerPage}
          updateSelection={setSelectedDuplicates}
        />
      </Wrapper>
      <TableActions
        disableSelect={isEmpty(selectedDuplicates)}
        disableDelete={isEmpty(selectedDuplicates)}
        onClickSelect={nextStep}
        onClickDelete={deleteSelected}
      />
    </>
  );
};

DuplicatesList.propTypes = {
  selectedDuplicates: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedDuplicates: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  duplicateType: PropTypes.oneOf(['entrance', 'document'])
};

export default DuplicatesList;
