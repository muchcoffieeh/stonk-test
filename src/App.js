import React, { useState } from 'react';
import './App.css';

async function fetchOptionChain(token, symbol, expiration, side) {
  try {
    const response = await fetch(`https://api.marketdata.app/v1/options/chain/${symbol}/?expiration=${expiration}&side=${side}&token=${token}`);
    const { optionSymbol, delta, strike, bid, ask } = await response.json();
    const optionChainData = optionSymbol.map((option, index) => ({
      symbol: option,
      delta: delta[index],
      strike: strike[index],
      bid: bid[index],
      ask: ask[index], // Assuming strike is an array with corresponding values
      entryCredit: (bid[index] + ask[index]) / 2, 
    }));
    return optionChainData;
  } catch (error) {
    console.error('Error fetching option chain:', error);
    return [];
  }
}

function App() {
  const [symbol, setSymbol] = useState('');
  const [expiration, setExpiration] = useState('');
  const [side, setSide] = useState('');
  const [optionChain, setOptionChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closestDelta, setClosestDelta] = useState(null);
  const token = process.env.REACT_APP_MARKET_DATA_TOKEN;

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleExpirationChange = (event) => {
    setExpiration(event.target.value);
  };

  const handleSideChange = (event) => {
    setSide(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (symbol && expiration && side) {
      setLoading(true);

      try {
        const data = await fetchOptionChain(token, symbol, expiration, side);
        console.log(data);
        setOptionChain(data);
        findClosestDelta(data);
      } catch (error) {
        console.error('Error fetching option chain:', error);
      }

      setLoading(false);
    }
  };

  const findClosestDelta = (data) => {
    let closest = null;
    let minDiff = Infinity;
    data.forEach((option) => {
      const diff = Math.abs(option.delta - (-0.25));
      if (diff < minDiff) {
        minDiff = diff;
        closest = option;
      }
    });
    setClosestDelta(closest);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="left-pane">
          <p>Enter a Stock Symbol:</p>
          <form onSubmit={handleSubmit}>
            <input type="text" value={symbol} onChange={handleSymbolChange} />
            <br />
            <p>Enter Expiration Date (YYYY-MM-DD):</p>
            <input type="text" placeholder="YYYY-MM-DD" value={expiration} onChange={handleExpirationChange} />
            <br />
            <p>Enter Side (call/put):</p>
            <input type="text" placeholder="call/put" value={side} onChange={handleSideChange} />
            <br />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Get Option Chain'}
            </button>
          </form>
        </div>

        <div className="right-pane">
          {optionChain.length > 0 ? (
            <div>
              <h2>Option Chain:</h2>
              {optionChain.map((option) => (
                <div key={option.symbol}>
                  <p>Option Symbol: {option.symbol}</p>
                  
                  <p>Delta: {option.delta}</p>
                  {/* Display other relevant option data */}
                </div>
              ))}
              {closestDelta && (
                <div>
                  <h2>Closest Delta to -0.25:</h2>
                  <p>Option Symbol: {closestDelta.symbol}</p>
                  <p>Delta: {closestDelta.delta}</p>
                  <p>Strike: {closestDelta.strike}</p>
                  <p>Bid Price: {closestDelta.bid}</p>
                  <p>Ask Price: {closestDelta.ask}</p>
                  <p>Entry Credit: {closestDelta.entryCredit}</p> {/* Render entry credit */}
                </div>
              )}
            </div>
          ) : (
            <p>No option chain data available.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
