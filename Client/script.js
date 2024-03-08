// #region Get
const makePlanner = document.getElementById("makePlanner");

makePlanner.addEventListener("click", async function (event) {
  makePlanner.disabled = true;
  setTimeout(function () {
    makePlanner.disabled = false;
  }, 5000);
  // EXPLAIN THIS!!!!
  const response = await fetch("http://localhost:4000/result"); //leads to the AI response
  const result = await response.text();
  document.getElementById("plannerResult").innerHTML = `<div>${result}</div>`; //shows the result in a <div> under the plannerResult ID in HTML
});
// #endregion Get

//# region API's

//# endregion API's

// #region Post
const submit = document.getElementById("submit");
document
  .getElementById("customLocationForm")
  .addEventListener("submit", async function (event) {
    submit.disabled = true;
    setTimeout(function () {
      submit.disabled = false;
    }, 3500);
    event.preventDefault();

    const input = document.getElementById("prompt"); // input of the user
    const prompt = input.value.trim();

    try {
      const weatherapiResponse = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API}&q=netherlands
        `
      );
      const weatherAPI = await weatherapiResponse.text();
      console.log(weatherAPI);
      console.log(weatherAPI);
      document.getElementById(
        "locationResult"
      ).innerHTML = `<p>${data.message}</p>`;
    } catch (error) {
      console.error("error", error);
    }
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
