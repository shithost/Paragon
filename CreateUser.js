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

  const isAdminInput = readlineSync.question('Is this user an admin? (yes/no): ');
  const isAdmin = isAdminInput.toLowerCase() === 'yes' || isAdminInput.toLowerCase() === 'y';

  const usersFilePath = path.join(__dirname, 'users.json');

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }

    const usernameExists = users.some(user => user.username === username);
    const emailExists = users.some(user => user.email === email);
    
    if (usernameExists) {
      console.log('This username is already in use. Please choose a different username.');
      return;
    }
    
    if (emailExists) {
      console.log('This email is already in use. Please choose a different email.');
      return;
    }
    
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return;
      }
    
      const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
    
      const newUserId = maxId + 1;
    
      const userData = {
        id: newUserId,
        username: username,
        email: email,
        password: hash,
        isAdmin: isAdmin
      };
    
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