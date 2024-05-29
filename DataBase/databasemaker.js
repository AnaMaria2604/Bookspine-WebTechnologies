const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySQL connected...");

// Connect to MySQL server
db.connect((err) => {
  if (err) {
    // Verificăm dacă eroarea nu este legată de MySQL
    if (err.code !== "ER_NOT_SUPPORTED_AUTH_MODE") {
      // Ridicăm excepția în cazul altor tipuri de erori
      throw err;
    } else {
      // Altfel, afișăm un mesaj relevant pentru eroarea de autentificare
      console.error("Authentication error:", err.message);
      return;
    }
  }
  console.log("MySQL connected...");
});

db.query("CREATE DATABASE IF NOT EXISTS data_bases", (err, result) => {
  if (err) {
    throw err;
  }
  console.log("Database created or already exists");

  db.changeUser({ database: "data_bases" }, (err) => {
    if (err) {
      throw err;
    }
    console.log("Switched to data_bases");

    const createuser = `
        CREATE TABLE IF NOT EXISTS user (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            last_name VARCHAR(45) NOT NULL,
            first_name VARCHAR(45) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            description VARCHAR(200) NULL,
            fav_quote VARCHAR(200) NULL
        )
      `;

    db.query(createuser, (err, result) => {
      if (err) {
        throw err;
      }
      console.log("Notes table created or already exists");
      db.end();
    });

    const sampleNotes = [
      {
        last_name: "ana",
        first_name: "maria",
        email: "@",
        password: "da",
        description: "blabla",
        fav_quote: "da",
      },
      {
        last_name: "ana",
        first_name: "maria",
        email: "@",
        password: "da",
        description: "blabla",
        fav_quote: "da",
      },
    ];

    sampleNotes.forEach((note) => {
      const query =
        "INSERT INTO user (last_name,first_name, email, password, description, fav_quote) VALUES (?,?,?,?,?,?)";
      db.query(query, [note.content], (err, result) => {
        if (err) {
          throw err;
        }
        console.log("Inserted sample note:", note.content);
      });
    });

    db.end((err) => {
      if (err) {
        throw err;
      }
      console.log("Database setup complete.");
    });
  });
});
// });
