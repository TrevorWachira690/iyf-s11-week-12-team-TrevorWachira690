// Owned by: Part 1, Person A
// See: docs/part-1-accounts-and-login/person-a-backend.md
//
// A safe practice file for learning how password hashing works.
// This file does NOT affect the real app - it's just for practice.
//
// Run this with: node backend/scripts/hashingExercise.js

const bcrypt = require('bcryptjs');

async function run() {
  const plainPassword = 'mySecret123';

  // 1. Generate a "salt" — random data mixed in so identical passwords
  //    don't produce identical hashes
  const salt = await bcrypt.genSalt(10);
  console.log('Salt:', salt);

  // 2. Hash the password using that salt
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  console.log('Original password:', plainPassword);
  console.log('Hashed password:  ', hashedPassword);

  // 3. Prove the hash is one-way — you can't reverse it, only compare
  const isCorrectMatch = await bcrypt.compare('mySecret123', hashedPassword);
  console.log('Does "mySecret123" match the hash?', isCorrectMatch); // true

  const isWrongMatch = await bcrypt.compare('wrongPassword', hashedPassword);
  console.log('Does "wrongPassword" match the hash?', isWrongMatch); // false

  // 4. Notice: hashing the same password twice gives different results,
  //    because the salt is random each time
  const hashedAgain = await bcrypt.hash(plainPassword, await bcrypt.genSalt(10));
  console.log('Same password, different hash:', hashedAgain);
}

run();  