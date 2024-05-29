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
