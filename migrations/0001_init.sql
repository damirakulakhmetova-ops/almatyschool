CREATE TABLE schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  funding TEXT NOT NULL,
  district TEXT,
  address TEXT,
  languages TEXT NOT NULL DEFAULT '[]',
  grades TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  tuition TEXT,
  lat REAL,
  lon REAL
);

CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_schools_funding ON schools(funding);
