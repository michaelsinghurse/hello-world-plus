CREATE TABLE IF NOT EXISTS names (
  id serial PRIMARY KEY,
  name varchar(20) NOT NULL,
  meaning varchar(100) DEFAULT '',
  url text DEFAULT '',
  last_queried timestamp with time zone DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id serial PRIMARY KEY,
  name_id integer NOT NULL REFERENCES names (id),
  ip inet NOT NULL,
  time timestamp with time zone DEFAULT now()
);
