const bcrypt = require('bcrypt');

// Password strength regex: min 8 chars, upper, lower, number, special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function isPasswordStrong(password) {
  return passwordRegex.test(password);
}

async function isPasswordReused(newPassword, passwordHistory) {
  for (const oldHash of passwordHistory) {
    if (await bcrypt.compare(newPassword, oldHash)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  isPasswordStrong,
  isPasswordReused,
};
