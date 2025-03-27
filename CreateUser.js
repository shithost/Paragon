const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

function createUser() {
  const username = readlineSync.question('Username: ');

  let email;
  while (true) {
    email = readlineSync.question('Email: ');
    if (email.includes('@')) {
      break;
    } else {
      console.log('Invalid email. Please enter a valid email address.');
    }
  }

  const password = readlineSync.question('Password: ', { hideEchoBack: true });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: hash
    };

    const usersFilePath = path.join(__dirname, 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      let users = [];
      if (!err && data) {
        users = JSON.parse(data);
      }
      users.push(userData);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error('Error writing user data:', err);
        } else {
          console.log('User created successfully!');
        }
      });
    });
  });
}

createUser();