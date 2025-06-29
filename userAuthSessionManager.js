const USER_SESSION_KEY = 'userAuthSession';
const SESSION_EXPIRY_TIME = 3600000; // 1 hour in milliseconds

function saveUserSession(sessionData) {
  const expiryTimestamp = Date.now() + SESSION_EXPIRY_TIME;
  const userSession = {
    ...sessionData,
    expiry: expiryTimestamp,
  };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
}

function getUserSession() {
  const sessionData = localStorage.getItem(USER_SESSION_KEY);
  if (sessionData) {
    try {
      const parsedSession = JSON.parse(sessionData);
      if (parsedSession.expiry > Date.now()) {
        return parsedSession;
      }
      clearUserSession();
    } catch (error) {
      console.error('Failed to parse session data:', error);
      clearUserSession();
    }
  }
  return null;
}

function clearUserSession() {
  localStorage.removeItem(USER_SESSION_KEY);
}

function isUserAuthenticated() {
  return getUserSession() !== null;
}

function updateUserSession(sessionData) {
  const existingSession = getUserSession();
  if (existingSession) {
    const updatedSession = {
      ...existingSession,
      ...sessionData,
      expiry: Date.now() + SESSION_EXPIRY_TIME, // Update expiry time to extend the session duration
    };
    saveUserSession(updatedSession);
  }
}

export { saveUserSession, getUserSession, clearUserSession, isUserAuthenticated, updateUserSession };