// Collapsible
var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

function getTime() {
  let today = new Date();
  hours = today.getHours();
  minutes = today.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let time = hours + ":" + minutes;
  return time;
}

// Gets the first message
function firstBotMessage() {
  let firstMessage = "How's it going?";
  document.getElementById("botStarterMessage").innerHTML =
    '<p class="botText"><span>' + firstMessage + "</span></p>";

  let time = getTime();

  $("#chat-timestamp").append(time);
  document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

// Retrieves the response
function getHardResponse(userText) {
  let botResponse = getBotResponse(userText);
  let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
  $("#chatbox").append(botHtml);

  document.getElementById("chat-bar-bottom").scrollIntoView(true);
}
let messages = [];
const fetchResponse = (userInput) => {
  return new Promise(async (res, reject) => {
    // try {
    //   setTimeout(() => {
    //     res(responseObj[userInput]);
    //    }, 1200);
    // } catch (error) {
    //   reject(error)
    // }
    messages.push({ user: "User", text: userInput, isSender: true });
    let msg = "";

    messages.map((mess, i) => {
      // console.log(mess.text);

      if (mess.user === "Bot") {
        msg += "Muskan: " + mess.text + "\n";
      } else {
        msg += "User: " + mess.text + "\n";
      }
      return "";
    });
    msg += "User: " + userInput + "\n";
    var formdata = new FormData();
    formdata.append("userMessage", msg);
    formdata.append("userName", ".");
    formdata.append("bot", "kind");

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    let response = await fetch(
      "https://us-central1-fir-project-82e95.cloudfunctions.net/chatAPI",
      requestOptions
    );
    let data = await response.json();
    console.log(data);
    // return data.message;
    const botRes = data.message.replace("User:", "");
    messages.push({ user: "Bot", text: botRes, isSender: false });
    res(botRes);
  });
};
//Gets the text text from the input box and processes it
async function getResponse() {
  let userText = $("#textInput").val();

  if (userText == "") {
    return;
    userText = "I love Code Palace!";
  }

  let userHtml = '<p class="userText"><span>' + userText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);
  const botResponse = await fetchResponse(userText);

  let botHtml = '<p class="botText"><span>' + botResponse + "</span></p>";
  $("#chatbox").append(botHtml);

  document.getElementById("chat-bar-bottom").scrollIntoView(true);
  //   setTimeout(() => {
  //     // getHardResponse(userText);
  //   }, 1000);
}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
  let userHtml = '<p class="userText"><span>' + sampleText + "</span></p>";

  $("#textInput").val("");
  $("#chatbox").append(userHtml);
  document.getElementById("chat-bar-bottom").scrollIntoView(true);

  //Uncomment this if you want the bot to respond to this buttonSendText event
  // setTimeout(() => {
  //     getHardResponse(sampleText);
  // }, 1000)
}

function sendButton() {
  getResponse();
}

function heartButton() {
  buttonSendText("Heart clicked!");
}

// Press enter to send a message
$("#textInput").keypress(function (e) {
  if (e.which == 13) {
    getResponse();
  }
});
