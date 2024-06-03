const getPopularBooks = (callback) => {
    connection.query(
      'SELECT * FROM books ORDER BY rating DESC LIMIT 10',
      (error, results) => {
        if (error) {
          return callback(error);
        }
        callback(null, results);
      }
    );
  };
  
  const getRecommendedBooks = (callback) => {
    connection.query(
      'SELECT * FROM books LIMIT 10',
      (error, results) => {
        if (error) {
          return callback(error);
        }
        callback(null, results);
      }
    );
  };
  module.exports={getPopularBooks,getRecommendedBooks};
  