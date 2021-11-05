import { useState, useEffect } from 'react';

const History = () => {
  const [loading, setLoading] = useState(false);
  const [rowLimit, setRowLimit] = useState(10);
  const [allNamesData, setAllNamesData] = useState([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [fullHistoryData, setFullHistoryData] = useState([]);

  const updateTable = (_evt) => {
    setLoading(true);

    fetch(`/history?limit=${rowLimit}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })
      .then(data => {
        setAllNamesData(data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(updateTable, [rowLimit]);

  const updateFullHistory = (nameId) => {
    setLoading(true);

    fetch(`/history/${nameId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })
      .then(data => {
        setFullHistoryData(data);
        setShowFullHistory(true);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteHistory = () => {
    fetch('/history/destroy', { method: 'POST' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        updateTable();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const allNamesRows = allNamesData.map((row, idx) => {
    return (
      <tr key={idx}>
        <th scope="row">{row.name}</th> 
        <td>{row.meaning}</td>
        <td>{row.request_count}</td>
        <td>{row.time}</td>
        <td>{row.ip}</td>
        <td>
          <button type="button" onClick={() => updateFullHistory(row.name_id)}>
            Show
          </button>
        </td>
      </tr>
    );
  });

  const fullHistoryRows = fullHistoryData.map((row, idx) => {
    return (
      <tr key={idx}>
        <th scope="row">{row.time}</th>
        <td>{row.ip}</td>
      </tr>
    );
  });

  return (
    <div className="history">
      {loading && <div>Loading...</div>}
      {!loading &&
        <>
          <label>Number of Rows
            <select value={rowLimit} onChange={evt => setRowLimit(evt.target.value)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
          <div>
            <button type="button" onClick={deleteHistory}>Clear History</button>
          </div>
        </>
      }
      {!loading && !!allNamesData.length &&
        <>
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Meaning</th>
                <th scope="col">Submitted Count</th>
                <th scope="col">Last Submitted Timestamp</th>
                <th scope="col">Last Submitted IP</th>
                <th scope="col">Full History</th>
              </tr>
            </thead>
            <tbody>
              {allNamesRows}
            </tbody>
          </table>
        </>
      }
      {!loading && showFullHistory &&
        <div className="full-history">
          <button type="button" onClick={() => setShowFullHistory(false)}>
            Close
          </button>
          <table>
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">IP</th>
              </tr>
            </thead>
            <tbody>
              {fullHistoryRows}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default History;
