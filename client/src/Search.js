import { useState } from 'react';

const Search = () => {
  const [nameInfo, setNameInfo] = useState({
    name: '',
    queried: false,
    meaning: '',
    url: ''
  });

  const [loading, setLoading] = useState(false);

  const submitName = (evt) => {
    evt.preventDefault();
    setLoading(true);

    fetch(`/name?q=${nameInfo.name}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        return res.json();
      })
      .then(data => {
        data.queried = true;
        setNameInfo(data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const updateName = (evt) => {
    setNameInfo(prevState => {
      return { ...prevState, name: evt.target.value }
    });
  };

  return ( 
    <>
      {loading && <div>Loading...</div>}
      {!loading && !nameInfo.queried &&
        <>
          <h2>What is your name?</h2>
          <form onSubmit={submitName}>
            <input type="text" minLength="2" maxLength="22" size="20"
              value={nameInfo.name}
              onChange={updateName}
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
      {!loading && !!nameInfo.queried &&
        <>
          <h2>Hello, {nameInfo.name}!</h2>
          <p>Meaning: {nameInfo.meaning || 'None found'}</p>
          {!!nameInfo.url && 
            <a href={nameInfo.url} rel="noreferrer" target="_blank">Read More</a>
          }
        </>
      }
    </>
  );
};

export default Search;
