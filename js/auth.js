// Register
async function registerUser(name, email, password) {
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) return alert(error.message);
  alert("Registered successfully!");
  window.location.href = "index.html";
}

// Login
async function loginUser(email, password) {
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
  window.location.href = "index.html";
}

// Logout
async function logoutUser() {
  await db.auth.signOut();
  window.location.href = "login.html";
}

// Protect pages (use on index.html). Returns the user.
async function requireAuth() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
    return null;
  }
  return data.session.user;
}