// A lot of dead code in this file, please remove before merging.
console.log("Hello from the frontend JS file");

function Pledges() {
  const me = {};

  const renderPledges = (pledges) => {
    const pledgeSlice = pledges.slice(-10).reverse(); // Only show last 10 pledges
    const pledgesDiv = document.getElementById("pledges");
    for (const { name, pledge, comment } of pledgeSlice) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div>Name: ${name} Pledge: $${pledge} Comment: ${comment}</div>`;
      pledgesDiv.appendChild(card);
    }
  };

  me.refreshPledges = async () => {
    const res = await fetch("/api/pledges");
    if (!res.ok) {
      console.error("Failed to fetch listings", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    console.log("Fetched pledges", data);

    const pledgesDiv = document.getElementById("pledges");
    pledgesDiv.innerHTML = "";

    renderPledges(data.pledges);
  };

  me.updateSummary = async () => {
    const res = await fetch("/api/sum");
    if (!res.ok) {
      console.error("Failed to fetch sum", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    console.log("Got data", data);
    const sumDiv = document.getElementById("raised");
    sumDiv.innerHTML = `<h3>Total Raised: $${data.pledgeSum}</h3>`;

    const countDiv = document.getElementById("pledgeCount");
    countDiv.innerHTML = `<h3>Pledge Count: ${data.pledgeCount} </h3>`;
  };

  return me;
}

const myPledges = Pledges();
myPledges.refreshPledges();
myPledges.updateSummary();

