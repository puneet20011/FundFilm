function Updates() {
  const me = {};

  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get("admin") === "theSuperSecretAdminKey"; //major securit risk , instead of hardcoing move the keys to .env file

  me.showError = ({ msg, res, type = "danger" } = {}) => {
    const main = document.querySelector("main");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = type;
    alert.innerText = `${msg}: ${res.status} ${res.statusText}`;
    main.prepend(alert);
  };

  me.initAdminControls = () => {
    if (isAdmin) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "btn btn-success mb-3";
      addButton.textContent = "+ Add New Update";
      addButton.onclick = () => {
        window.location.href = "add-update.html?admin=theSuperSecretAdminKey"; //major securit risk , instead of hardcoing move the keys to .env file
      };

      const updatesDiv = document.getElementById("updates");
      updatesDiv.parentElement.insertBefore(addButton, updatesDiv);
    }
  };

  me.deleteUpdate = async (id) => {
    if (!confirm("Are you sure you want to delete this update?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/updates/${id}?admin=theSuperSecretAdminKey`, //major securit risk , instead of hardcoing move the keys to .env file
        {
          method: "DELETE",
        },
      );

      if (res.status === 403) {
        alert("Forbidden: You do not have permission to delete this update.");
        return;
      }

      if (!res.ok) {
        console.error("Failed to delete update", res.status, res.statusText);
        me.showError({ msg: "Failed to delete update", res });
        return;
      } else {
        alert("Update deleted successfully.");
        me.refreshListings();
      }
    } catch (err) {
      console.error("Network error:", err);
      me.showError({
        msg: "Network error",
        res: { status: 0, statusText: err.message },
      });
    }
  };

  const renderUpdates = (updates) => {
    const updatesDiv = document.getElementById("updates");
    updatesDiv.innerHTML = "";

    updates.forEach((update) => {
      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-4 mb-4";
      card.innerHTML = `
                <div class="card h-100">
                    <img src="${update.image}" class="card-img-top" alt="${update.title}" style="height: 250px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${update.title}</h5>
                        <p class="card-text">${update.gist}</p>
                         <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target= "#updateModal${update._id}"
                  >
                    View Update
                  </button>
                  ${
                    isAdmin
                      ? `
                      <button
                      type="button"
                      class="btn btn-warning ms-2"
                      onclick="window.location.href='add-update.html?admin=theSuperSecretAdminKey&edit=${update._id}'" 
                    >Edit</button>
                    <button
                      type="button"
                      class="btn btn-danger ms-2"
                      onclick="myUpdates.deleteUpdate('${update._id}')"
                      >Delete</button>`
                      : "" //major securit risk , instead of hardcoing move the keys to .env file
                  }
                  
                    </div>
                </div>

                <div class="modal fade" id="updateModal${update._id}" tabindex="-1" aria-labelledby="updateModalLabel${update._id}" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">

                        <div class="modal-header">
                            <h5 class="modal-title" id="updateModalLabel${update._id}">${update.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="modal-body">
                            <img src="${update.modal_image}" class="d-block mx-auto" style="height: 300px; object-fit: cover" alt="${update.title}" />
                            <p>${update.summary}</p>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>1

                    </div>
                </div>
            </div>

            `;
      updatesDiv.appendChild(card);
    });
  };

  me.refreshListings = async () => {
    try {
      const res = await fetch("/api/updates");

      if (!res.ok) {
        console.error("Failed to fetch updates", res.status, res.statusText);
        me.showError({ msg: "Failed to fetch updates", res });
        return;
      }

      const data = await res.json();
      console.log("Fetched updates:", data);

      renderUpdates(data.updates || []);
    } catch (err) {
      console.error("Network error:", err);
      me.showError({
        msg: "Network error",
        res: { status: 0, statusText: err.message },
      });
    }
  };

  return me;
}

const myUpdates = Updates();
window.myUpdates = myUpdates;
myUpdates.refreshListings();
myUpdates.initAdminControls();
