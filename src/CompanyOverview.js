import React from 'react';

const CompanyOverview = ({ companyInfo }) => {
  return (
    <div>
      <h2>Company Information:</h2>
      <p>Symbol: {companyInfo.Symbol}</p>
      <p>Company Name: {companyInfo.Name}</p>
      <p>Industry: {companyInfo.Industry}</p>
    </div>
  );
};

export default CompanyOverview;
