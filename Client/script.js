// #region Get
document
  .getElementById("makePlanner")
  .addEventListener("click", async function () {
    // EXPLAIN THIS!!!!
    const response = await fetch("http://localhost:4000/result"); //leads to the AI response
    const result = await response.text();
    document.getElementById("plannerResult").innerHTML = `<div>${result}</div>`; //shows the result in a <div> under the plannerResult ID in HTML
    // appendMessage("plannerResult");
  });
// #endregion Get

// #region Post
document
  .getElementById("customLocationForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const input = document.getElementById("prompt"); // input of the user
    const prompt = input.value.trim();

    // EXPLAIN THIS!!!!
    try {
      const response = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      // EXPLAIN THIS!!!!
      const data = await response.json();
      document.getElementById(
        "locationResult"
      ).innerHTML = `<p>${data.message}</p>`;
    } catch (error) {
      console.error("error", error);
    }
  });
// #endregion Post
