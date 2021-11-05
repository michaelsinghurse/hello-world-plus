import { useState, useEffect } from 'react';
import History from './History.js';
import Search from './Search.js';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [userData, setUserData] = useState({});

  const setNameQuery = (query) => {
    setUserData(prevVal => {
      return {...prevVal, query: query};
    });
  };

  const clearSession = () => {
    fetch('/session/destroy', { method: 'POST' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(
    () => {
      fetch('/user')
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }

          return res.json();
        })
        .then(data => {
          setUserData(data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    []
  );

  return (
    <div>
      <h1>Hello World+</h1>
      <button type="button" onClick={() => setActiveTab('search')}>Search</button>
      <button type="button" onClick={() => setActiveTab('history')}>History</button>
      {!!userData.fakeSessionId &&
        <>
          <p>Fake Session Id: {userData.fakeSessionId}</p>
          <button type="button" onClick={clearSession}>Clear Session</button>
        </>
      }
      <hr/>
      {activeTab === 'search' &&
        <Search nameQuery={userData.query} setNameQuery={setNameQuery} />}
      {activeTab === 'history' && <History />}
    </div>
  );
}

export default App;
