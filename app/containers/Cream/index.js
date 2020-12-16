import BigNumber from 'bignumber.js';
import { selectContracts, selectContractData } from 'containers/App/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import { BLOCKS_PER_YEAR } from './constants';
import saga from './saga';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 50px 40px;
`;

const CreamBorrowMarketRow = ({ creamCTokenAddress }) => {
  const creamTokenData = useSelector(selectContractData(creamCTokenAddress));
  const underlyingTokenData = useSelector(
    selectContractData(creamTokenData.underlying),
  );

  let borrowRatePerYear = new BigNumber(
    creamTokenData.borrowRatePerBlock * BLOCKS_PER_YEAR,
  )
    .dividedBy(10 ** 16)
    .toFixed(2);
  if (Number.isNaN(borrowRatePerYear)) {
    borrowRatePerYear = '...';
  }

  let walletBalance = new BigNumber(underlyingTokenData.balanceOf)
    .dividedBy(10 ** underlyingTokenData.decimals) // Need to get tokenDecimals
    .toFixed(2);
  if (Number.isNaN(walletBalance)) {
    walletBalance = '...';
  }

  let liquidity = new BigNumber(creamTokenData.getCash)
    .dividedBy(10 ** underlyingTokenData.decimals) // Need to get tokenDecimals
    .toFixed(2, BigNumber.ROUND_DOWN);
  if (Number.isNaN(liquidity)) {
    liquidity = '...';
  }

  // (cyWETH) needs to be special-cased so it's APY is incorrect for now see
  // iearn-finance:src/stores/store.jsx:4197

  return (
    <tr>
      <td>{underlyingTokenData.symbol}</td>
      <td>{`${borrowRatePerYear}%`}</td>
      <td>{`${walletBalance} ${underlyingTokenData.symbol}`}</td>
      <td>{liquidity}</td>
    </tr>
  );
};

const Cream = () => {
  useInjectSaga({ key: 'cream', saga });

  const creamCTokens = useSelector(selectContracts('creamCTokens'));
  const creamCTokenAddresses = _.map(creamCTokens, token => token.address);

  return (
    <Wrapper>
      <h1>Borrow Market</h1>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Asset</th>
            <th style={{ textAlign: 'left' }}>APY</th>
            <th style={{ textAlign: 'left' }}>Wallet</th>
            <th style={{ textAlign: 'left' }}>Liquidity</th>
          </tr>
        </thead>
        <tbody>
          {creamCTokenAddresses.map(creamCTokenAddress => (
            <CreamBorrowMarketRow
              key={creamCTokenAddress}
              creamCTokenAddress={creamCTokenAddress}
            />
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

Cream.whyDidYouRender = true;
export default Cream;
