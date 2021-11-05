require('dotenv').config();
const { deleteHistory } = require('./persistence.js');

(async () => {
  const success = await deleteHistory();

  if (success) {
    console.log('done');
  } else {
    console.log('not done');
  }
})();
