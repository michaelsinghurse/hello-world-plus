import { useState } from 'react';
import History from './History.js';
import Search from './Search.js';

function App() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div>
      <h1>Hello World+</h1>
      <button type="button" onClick={() => setActiveTab('search')}>Search</button>
      <button type="button" onClick={() => setActiveTab('history')}>History</button>
      <hr/>
      {activeTab === 'search' && <Search />}
      {activeTab === 'history' && <History />}
    </div>
  );
}

export default App;
