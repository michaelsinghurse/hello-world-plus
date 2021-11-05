const { dbQuery } = require('./dbQuery.js');

async function addLastTimestampAndIp(rows) {
  const sql = `
    WITH cte AS
    (
      SELECT
        ROW_NUMBER() OVER (
            PARTITION BY name_id
            ORDER BY time DESC
        ),
        name_id,
        ip,
        time
      FROM requests
    )
    SELECT name_id, ip, time
    FROM cte
    WHERE row_number = 1
  `;

  const result = await dbQuery(sql);

  if (result.rowCount > 0) {
    const requestsData = result.rows;

    rows.map(row => {
      const matchingRow = requestsData.find(innerRow => {
        return row.name_id === innerRow.name_id;
      });

      if (matchingRow) {
        row.ip = matchingRow.ip;
        row.time = matchingRow.time;
      }

      return row;
    });

    return rows;
  } else {
    return rows;
  }
}

async function deleteHistory() {
  const sql = `
    DELETE FROM requests
  `;

  const result = await dbQuery(sql);

  return true;
}

async function getHistoryData(limit) {
  const sql = `
    SELECT n.id AS name_id, name, meaning, COUNT(*) AS request_count
    FROM names AS n
      INNER JOIN requests AS r
      ON n.id = r.name_id
    GROUP BY n.id
    ORDER BY request_count DESC, name
    LIMIT $1
  `;

  const result = await dbQuery(sql, limit);

  if (result.rowCount > 0) {
    const rows = result.rows;
    await addLastTimestampAndIp(rows);
    return rows;
  } else {
    return [];
  }
}

async function getHistoryDataForName(nameId) {
  const sql = `
    SELECT ip, time
    FROM requests
    WHERE name_id = $1
    ORDER BY time DESC
  `;

  const result = await dbQuery(sql, nameId);

  if (result.rowCount > 0) {
    return result.rows;
  } else {
    return null;
  }
}

async function getNameId(name) {
  const sql = `
    SELECT id
    FROM names
    WHERE name = $1
  `;

  const result = await dbQuery(sql, name);

  if (result.rowCount > 0) {
    return result.rows[0].id;
  } else {
    return null;
  }
}

async function getNameData(name) {
  const sql = `
    SELECT name, meaning, url
    FROM names
    WHERE name = $1
  `;

  const result = await dbQuery(sql, name);

  if (result.rowCount > 0) {
    return result.rows[0];
  } else {
    return null;
  }
}

async function insertName(name) {
  const sql = `
    INSERT INTO names (name)
    VALUES ($1)
    RETURNING id
  `;

  const result = await dbQuery(sql, name);

  if (result.rowCount > 0) {
    return result.rows[0].id;
  } else {
    return null;
  }
}

async function nameHasBeenScraped(name) {
  const sql = `
    SELECT last_queried
    FROM names
    WHERE name = $1
  `;

  const result = await dbQuery(sql, name);

  if (result.rowCount > 0) {
    return !!result.rows[0].last_queried;
  } else {
    return false;
  }
}

async function setNameData(name, data) {
  const sql = `
    UPDATE names
    SET meaning = $1, url = $2, last_queried = now()
    WHERE name = $3
  `;

  const result = await dbQuery(sql, data.meaning, data.url, name);

  return result.rowCount > 0;
}

async function setNameRequest(name, ip) {
  let nameId = await getNameId(name);

  if (!nameId) {
    nameId = await insertName(name);
  }

  const sql = `
    INSERT INTO requests (name_id, ip)
    VALUES ($1, $2)
  `;

  const result = await dbQuery(sql, nameId, ip);

  return result.rowCount > 0;
}

module.exports = {
  deleteHistory,
  getHistoryData,
  getHistoryDataForName,
  getNameData,
  nameHasBeenScraped,
  setNameData,
  setNameRequest
};

