import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import {
  Typography,
  Card as MuiCard,
  CardActions as MuiCardActions,
  IconButton as MuiIconButton,
  CardContent as MuiCardContent,
  CardHeader
} from '@material-ui/core';
import styled from 'styled-components';
import CreateIcon from '@material-ui/icons/Create';

const Card = styled(MuiCard)`
  margin: ${({ theme }) => theme.spacing(2)}px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardContent = styled(MuiCardContent)`
  flex-grow: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

const CardActions = styled(MuiCardActions)`
  display: flex;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IconButton = styled(MuiIconButton)`
  margin-left: auto;
`;

const FixedContent = ({
  avatar,
  subheader,
  title,
  icon,
  content,
  footer,
  onEdit
}) => {
  return (
    <Card>
      <CardHeader
        avatar={avatar}
        subheader={subheader}
        title={
          <Title>
            <Typography variant="h1" color="secondary">
              {title}
            </Typography>
            {!isNil(icon) && icon}
          </Title>
        }
      />
      <CardContent>{content}</CardContent>
      <CardActions disableSpacing>
        {!isNil(footer) && <Typography variant="caption">{footer}</Typography>}
        {!isNil(onEdit) && (
          <IconButton size="small" aria-label="edit" onClick={onEdit}>
            <CreateIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

FixedContent.propTypes = {
  avatar: PropTypes.node,
  content: PropTypes.node.isRequired,
  footer: PropTypes.string,
  icon: PropTypes.node,
  onEdit: PropTypes.func,
  subheader: PropTypes.node,
  title: PropTypes.string.isRequired
};

export default FixedContent;
