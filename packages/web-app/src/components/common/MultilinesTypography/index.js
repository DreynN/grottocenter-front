import { Typography } from '@material-ui/core';
import styled from 'styled-components';

const MultilinesTypography = styled(Typography)({
  whiteSpace: 'pre-wrap',
  margin: '10px 0'
});

export default MultilinesTypography;
