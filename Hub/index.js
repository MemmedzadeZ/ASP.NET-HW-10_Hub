const url = "https://localhost:7183/";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(url + "offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

const timeCount = 10;

async function start() {
  try {
    await connection.start();
    console.log("SignalR connected");

    $.get(url + "api/offer", function (data, status) {
      element.innerHTML += "Begin Prise" + data + "$";
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

connection.on("ReceiveConnectInfo", (message) => {
  let element = document.querySelector("#info");
  element.innerHTML += message;
});

connection.on("RecieveDisConnectedInfo", (message) => {
  let element = document.querySelector("#info-2");
  element.innerHTML = message;
});

connection.on("ReceiveMessage", (message, value) => {
  let element = document.querySelector("#offerResponseValue");
  element.innerHTML = message + " " + value + "$";
});

connection.on("SecondCount", () => {
  let submitBtn = document.querySelector("#btn");
  let seconds = document.querySelector("#second");

  timeSize = 10;
  seconds.innerHTML = "";
  submitBtn.disabled = false;
  clearInterval(myInterval);
});

function IncreaseOffer() {
  const user = document.querySelector("#user");

  $.get(url + "api/Offer/Increase?data=100", function (data, status) {
    $.get(url + "api/Offer", function (data, status) {
      connection.invoke("SendMessage", user.value);
    });
  });
}
