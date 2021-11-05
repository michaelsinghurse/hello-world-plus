import { useState } from 'react';

const Search = ({ nameQuery, setNameQuery }) => {
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);

  const submitName = (evt) => {
    evt.preventDefault();
    setLoading(true);

    fetch(`/name?q=${searchName}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })
      .then(data => {
        setNameQuery(data);
        setSearchName('');
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return ( 
    <>
      {loading && <div>Loading...</div>}
      {!loading && !nameQuery &&
        <>
          <h2>What is your name?</h2>
          <form onSubmit={submitName}>
            <input type="text" minLength="2" maxLength="22" size="20"
              value={searchName}
              onChange={evt => setSearchName(evt.target.value)}
              pattern="[a-z,A-Z]{2,22}"
              title="Name must be all letters and between 2 and 20 characters"
              placeholder="Enter your name..."
              autoFocus
              required
            />
            <input type="submit" value="Submit" />
          </form>
        </>
      }
      {!loading && !!nameQuery &&
        <>
          <h2>Hello, {nameQuery.name}!</h2>
          <p>Meaning: {nameQuery.meaning || 'None found'}</p>
          {!!nameQuery.url &&
            <a href={nameQuery.url} rel="noreferrer" target="_blank">Read More</a>
          }
        </>
      }
    </>
  );
};

export default Search;
