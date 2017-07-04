
const BASIC_QUERY_HEADER = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'KENYA-API-KEY': process.env.KENYA_API_KEY
  }
};

export {
  BASIC_QUERY_HEADER
};
