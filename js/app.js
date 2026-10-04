const SUBJECTS = ["DBMS", "AI", "Web", "Cloud", "General"];

let notes = [];
let resources = [];
let activeSubject = "All";
let editingId = null;

// Stops HTML injection from note text
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ---------- INIT ----------
(async function init() {
  const user = await requireAuth();
  if (!user) return;

  const name = user.user_metadata?.name || user.email;
  document.getElementById("userName").textContent = "👤 " + name;
  document.getElementById("welcomeText").textContent = `Welcome back, ${name}! 🌻`;

  // Fill subject dropdowns
  const options = SUBJECTS.map((s) => `<option value="${s}">${s}</option>`).join("");
  document.getElementById("noteSubject").innerHTML = options;
  document.getElementById("resSubject").innerHTML = options;

  renderChips();
  document.getElementById("searchInput").addEventListener("input", renderNotes);
  document.getElementById("resourceForm").addEventListener("submit", addResource);

  await loadNotes();
  await loadResources();
})();

// ---------- SUBJECT CHIPS ----------
function renderChips() {
  const all = ["All", ...SUBJECTS];
  document.getElementById("chips").innerHTML = all
    .map((s) => `<button class="chip ${s === activeSubject ? "active" : ""}" onclick="setSubject('${s}')">${s}</button>`)
    .join("");
}
function setSubject(s) {
  activeSubject = s;
  renderChips();
  renderNotes();
  renderResources();
}

// ---------- NOTES ----------
async function loadNotes() {
  const { data, error } = await db.from("notes").select("*").order("created_at", { ascending: false });
  if (error) return alert(error.message);
  notes = data;
  renderNotes();
}

function renderNotes() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const list = notes.filter((n) =>
    (activeSubject === "All" || n.subject === activeSubject) &&
    (n.title.toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q))
  );

  const grid = document.getElementById("notesGrid");
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No notes yet. Click "Add Note" to plant your first one.</p>`;
    return;
  }
  grid.innerHTML = list.map((n) => `
    <div class="note-card">
      <span class="tag">${esc(n.subject)}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.content)}</p>
      <span class="date">${new Date(n.created_at).toLocaleDateString()}</span>
      <div class="card-actions">
        <button class="btn-edit" onclick="openNoteModal('${n.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteNote('${n.id}')">Delete</button>
      </div>
    </div>`).join("");
}

function openNoteModal(id = null) {
  editingId = id;
  const note = id ? notes.find((n) => n.id === id) : null;
  document.getElementById("modalTitle").textContent = note ? "Edit Note ✏️" : "New Note 🌻";
  document.getElementById("noteTitle").value = note ? note.title : "";
  document.getElementById("noteContent").value = note ? note.content || "" : "";
  document.getElementById("noteSubject").value = note ? note.subject : "General";
  document.getElementById("noteModal").classList.add("show");
}
function closeNoteModal() {
  document.getElementById("noteModal").classList.remove("show");
}

async function saveNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  const subject = document.getElementById("noteSubject").value;
  if (!title) return alert("Please enter a title");

  let error;
  if (editingId) {
    ({ error } = await db.from("notes").update({ title, content, subject }).eq("id", editingId));
  } else {
    ({ error } = await db.from("notes").insert({ title, content, subject }));
  }
  if (error) return alert(error.message);

  closeNoteModal();
  loadNotes();
}

async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  const { error } = await db.from("notes").delete().eq("id", id);
  if (error) return alert(error.message);
  loadNotes();
}

// ---------- RESOURCES ----------
async function loadResources() {
  const { data, error } = await db.from("resources").select("*").order("created_at", { ascending: false });
  if (error) return alert(error.message);
  resources = data;
  renderResources();
}

function renderResources() {
  const list = resources.filter((r) => activeSubject === "All" || r.subject === activeSubject);
  const ul = document.getElementById("resourceList");
  if (list.length === 0) {
    ul.innerHTML = `<p class="empty">No resources yet.</p>`;
    return;
  }
  ul.innerHTML = list.map((r) => `
    <li class="resource-item">
      <span>
        <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a>
        <small>${esc(r.subject)}</small>
      </span>
      <button class="btn-delete" onclick="deleteResource('${r.id}')">🗑</button>
    </li>`).join("");
}

async function addResource(e) {
  e.preventDefault();
  const title = document.getElementById("resTitle").value.trim();
  const url = document.getElementById("resUrl").value.trim();
  const subject = document.getElementById("resSubject").value;

  const { error } = await db.from("resources").insert({ title, url, subject });
  if (error) return alert(error.message);

  e.target.reset();
  loadResources();
}

async function deleteResource(id) {
  if (!confirm("Delete this resource?")) return;
  const { error } = await db.from("resources").delete().eq("id", id);
  if (error) return alert(error.message);
  loadResources();
}