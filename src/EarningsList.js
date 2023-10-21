import React from 'react';

const EarningsList = ({ earnings }) => {
  return (
    <div className="earnings-list">
      <h3>Annual Earnings:</h3>
      {earnings.annualEarnings.map((earnings, index) => (
        <div key={index}>
          <p>Year: {earnings.fiscalDateEnding}</p>
          <p>Reported EPS: {earnings.reportedEPS}</p>
          <p>Estimated EPS: {earnings.estimatedEPS}</p>
        </div>
      ))}

      <h3>Quarterly Earnings:</h3>
      {earnings.quarterlyEarnings.map((earnings, index) => (
        <div key={index}>
          <p>Quarter: {earnings.fiscalDateEnding}</p>
          <p>Reported EPS: {earnings.reportedEPS}</p>
          <p>Estimated EPS: {earnings.estimatedEPS}</p>
        </div>
      ))}
    </div>
  );
};

export default EarningsList;
