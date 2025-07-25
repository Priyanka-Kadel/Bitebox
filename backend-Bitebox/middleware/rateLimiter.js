const WINDOW_MS = 2* 60 * 1000; 
const MAX_ATTEMPTS = 5;

const attempts = {};

function loginAttemptLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!attempts[ip]) {
    attempts[ip] = { count: 0, firstAttempt: now };
  }

  if (now - attempts[ip].firstAttempt > WINDOW_MS) {
    attempts[ip] = { count: 0, firstAttempt: now };
  }

  req.loginLimiter = {
    blocked: false,
    increment: () => { attempts[ip].count += 1; },
    reset: () => { attempts[ip] = { count: 0, firstAttempt: now }; }
  };

  if (attempts[ip].count >= MAX_ATTEMPTS) {
    req.loginLimiter.blocked = true;
    console.warn(`Blocked login attempt from IP: ${ip}`);
  }

  next();
}

module.exports = { loginAttemptLimiter }; 