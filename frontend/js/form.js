const form = document.getElementById("updateForm");
const message = document.getElementById("message");
const pageTitle = document.querySelector("h1");
const submitButton = form.querySelector('button[type="submit"]');

// Check if we're editing
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("edit");
const isEditing = !!editId;

console.log("Edit ID:", editId);
console.log("Is Editing:", isEditing);

// If editing, fetch and populate the form
if (isEditing) {
  pageTitle.textContent = "Edit Project Update";
  submitButton.textContent = "Update";

  // Make file inputs optional when editing
  document.getElementById("image").removeAttribute("required");
  document.getElementById("modal_image").removeAttribute("required");

  console.log("Fetching update data for ID:", editId);

  // Fetch existing update data
  fetch(`/api/updates/${editId}`)
    .then((res) => {
      console.log("Response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Received data:", data);
      const update = data.update;

      document.getElementById("title").value = update.title;
      document.getElementById("gist").value = update.gist;
      document.getElementById("summary").value = update.summary;

      console.log("Form populated successfully");

      // Show current images
      if (update.image) {
        const imageLabel = document.querySelector('label[for="image"]');
        imageLabel.innerHTML = `Thumbnail (Current: <a href="${update.image}" target="_blank">view</a>)`;
      }
      if (update.modal_image) {
        const modalLabel = document.querySelector('label[for="modal_image"]');
        modalLabel.innerHTML = `Image (Current: <a href="${update.modal_image}" target="_blank">view</a>)`;
      }
    })
    .catch((err) => {
      console.error("Error fetching update:", err);
      message.textContent = "Error loading update data";
      message.classList.add("text-danger");
    });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const url = isEditing
      ? `/api/updates/${editId}?admin=theSuperSecretAdminKey` //major securit risk , instead of hardcoing move the keys to .env file
      : "/api/updates";

    const method = isEditing ? "PUT" : "POST";

    console.log("Submitting to:", url, "Method:", method);

    const res = await fetch(url, {
      method: method,
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      message.textContent = result.message;
      message.classList.remove("text-danger");
      message.classList.add("text-success");

      if (!isEditing) {
        form.reset();
      }

      // Redirect back to updates page after 2 seconds
      setTimeout(() => {
        window.location.href = "index.html?admin=theSuperSecretAdminKey"; //major securit risk , instead of hardcoing move the keys to .env file
      }, 2000);
    } else {
      message.textContent = result.error || "Failed to submit update";
      message.classList.remove("text-success");
      message.classList.add("text-danger");
    }
  } catch (err) {
    console.error("Network error:", err);
    message.textContent = "Network error. Check console.";
    message.classList.remove("text-success");
    message.classList.add("text-danger");
  }
});
