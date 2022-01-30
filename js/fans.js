(() => {
  let name;
  let text;
  let time;
  if (Object.keys(localStorage).length !== 0) {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("fans")
    );
    for (let i = 0; i < keys.length / 3; i++) {
      name = localStorage.getItem(`fansName${i}`);
      text = localStorage.getItem(`fansText${i}`);
      time = localStorage.getItem(`fansTime${i}`);
      post(name, text, time);
      localStorage.removeItem(`fansName${i}`);
      localStorage.removeItem(`fansText${i}`);
      localStorage.removeItem(`fansTime${i}`);
    }
  }
})();

display();

const form = document.getElementById("form-post");
const postsDiv = document.getElementById("posts");
let number = 0;

form.onsubmit = function (e) {
  const name = document.getElementById("name");
  const text = document.getElementById("text_post");
  let nameVal = name.value;
  let textVal = text.value;
  let time = date();
  let msg;
  e.preventDefault();
  if (validateName() && validateText()) {
    sendPost();
    number++;
    form.reset();
  } else {
    return false;
  }

  function validateName() {
    if (!nameVal || nameVal < 2 || nameVal > 30) {
      msg = "name should be more then 2 and less then 30 characters";
      document.getElementById(
        "name_inform"
      ).innerHTML = `<p class="alert alert-danger">${msg}</p>`;
      name.classList.add("error");
      return false;
    } else {
      name.classList.remove("error");
      document.getElementById("name_inform").innerHTML = "";
      return true;
    }
  }

  function validateText() {
    if (!textVal || textVal < 2 || textVal > 120) {
      msg = "text should be more then 2 and less then 120 characters";
      document.getElementById(
        "text_inform"
      ).innerHTML = `<p class="alert alert-danger">${msg}</p>`;
      text.classList.add("error");
      return false;
    } else {
      text.classList.remove("error");
      document.getElementById("text_inform").innerHTML = "";
      return true;
    }
  }

  function sendPost() {
    if (!isOnline()) {
      localStorage.setItem(`fansName${number}`, nameVal);
      localStorage.setItem(`fansText${number}`, textVal);
      localStorage.setItem(`fansTime${number}`, date());
    } else {
      post(nameVal, textVal, date());
    }
  }
};

function isOnline() {
  return window.navigator.onLine;
}

async function post(fansName, fansText, fansTime) {
  const url = "http://localhost:3000/posts";
  const data = { name: fansName, text: fansText, time: fansTime };
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log("Success:", JSON.stringify(json));
  } catch (error) {
    console.error("Error:", error);
  }
}

function date() {
  const date = new Date();
  return `${date.toLocaleString()}`;
}

function display() {
  let newPost;

  fetch("http://localhost:3000/posts")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach((element) => {
        newPost = document.createElement("div");
        newPost.setAttribute("class", "post");
        name = element.name;
        text = element.text;
        time = element.time;
        newPost.innerHTML = `<p>${element.text}</p><div class='d-flex justify-content-between'><time class='d-flex p-2 m-2'>${element.time}</time><h4>${element.name}</h4></div>`;
        postsDiv.append(newPost);
      });
    });
}
