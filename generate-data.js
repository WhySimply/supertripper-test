const { faker } = require('@faker-js/faker');
const fs = require('fs');

const generateUsers = (count) => {
  const users = [];
  for (let id = 1; id <= count; id++) {
    users.push({
      id,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(true)
    });
  }
  return users;
};

const users = generateUsers(1000);
const db = { users };

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Data generated successfully!');