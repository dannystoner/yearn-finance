import React from 'react';
import styled from 'styled-components';
import ColumnList from 'components/Vault/columns';

const ColumnHeader = styled.div`
  margin-bottom: 10px;
  padding-top: 20px;
  font-size: 17px;
  text-transform: uppercase;
`;

export default function VaultsHeader() {
  return (
    <ColumnList>
      <ColumnHeader>Asset</ColumnHeader>
      <ColumnHeader>Vault Assets</ColumnHeader>
      <ColumnHeader>Growth</ColumnHeader>
      <ColumnHeader>Available to deposit</ColumnHeader>
      <ColumnHeader>Deposited</ColumnHeader>
    </ColumnList>
  );
}
