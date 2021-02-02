import React from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { useShowDevVaults } from 'containers/Vaults/hooks';

export default function ButtonFilled(props) {
  const { onClick, disabled, children, type, title, onSubmit, color } = props;
  const showDevVaults = useShowDevVaults();

  const ColorButton = withStyles(() => ({
    root: {
      fontFamily: 'Roboto',
      fontSize: '16px',
      padding: '8px 20px 8px 20px',
      margin: color === 'secondary' ? '0px' : '10px 0px',
      width: '100%',
      direction: 'ltr',
      height: '46px',
      textTransform: showDevVaults ? 'inherit' : 'capitalize',
      backgroundColor: color === 'secondary' ? '#999' : '#0657F9',
      color: color === 'secondary' ? '#333' : '#fff',
      '&:hover': {
        backgroundColor: color === 'secondary' ? '#999' : '#0657F9',
      },
      '&:disabled': {
        color: color === 'secondary' ? '#333' : '#fff',
        backgroundColor: color === 'secondary' ? '#444' : '#666',
        cursor: 'not-allowed',
      },
      textAlign: 'center',
    },
  }))(Button);

  return (
    <ColorButton
      variant="contained"
      disabled={disabled}
      title={title}
      color={color}
      onClick={onClick}
      onSubmit={onSubmit}
      type={type}
    >
      {children}
    </ColorButton>
  );
}
