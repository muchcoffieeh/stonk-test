import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import Chart from 'chart.js';
import { Chart } from 'react-chartjs-2';

async function fetchCashFlow(apiKey, symbol) {
  const url = `https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${symbol}&apikey=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
}

function CashFlowChart({ symbol, apiKey }) {
  const [cashFlowData, setCashFlowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cashFlow = await fetchCashFlow(apiKey, symbol);
        setCashFlowData(cashFlow);
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol, apiKey]);

  useEffect(() => {
    if (cashFlowData) {
      // Process and manipulate cashFlowData to prepare chart data
      const chartData = {
        labels: cashFlowData.annualReports.map((report) => report.fiscalDateEnding),
        datasets: [
          {
            label: 'Operating Cash Flow',
            data: cashFlowData.annualReports.map((report) => parseFloat(report.operatingCashflow)),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          // Add additional datasets as needed
        ],
      };

      // Create and configure the chart
      const ctx = document.getElementById('cashFlowChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Fiscal Year',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Amount (in millions)',
              },
            },
          },
        },
      });
    }
  }, [cashFlowData]);

  return (
    <div>
      <h2>Cash Flow Chart:</h2>
      <canvas id="cashFlowChart" width="400" height="200"></canvas>
    </div>
  );
}

export default CashFlowChart;
