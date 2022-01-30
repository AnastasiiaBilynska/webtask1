let img;
const loadFile = (event) => {
  const selectedFile = event.target.files[0];
  const reader = new FileReader();
  const imgtag = document.getElementById("output");
  output.title = selectedFile.name;
  reader.onload = function (event) {
    imgtag.src = event.target.result;
    img = event.target.result;
  };
  reader.readAsDataURL(selectedFile);
};

const form = document.getElementById("form-news");
let number = 0;

form.onsubmit = function (e) {
  const title = document.getElementById("title");
  const text = document.getElementById("text_news");
  let titleVal = title.value;
  let textVal = text.value;
  let msg;

  e.preventDefault();
  if (validateTitle() && validateText()) {
    sendNews();
    reset();
  } else {
    return false;
  }

  function validateTitle() {
    if (!titleVal || titleVal < 2 || titleVal > 60) {
      msg = "title should be more then 2 and less then 60 characters";
      document.getElementById(
        "title_inform"
      ).innerHTML = `<p class="alert alert-danger">${msg}</p>`;
      title.classList.add("error");
      return false;
    } else {
      title.classList.remove("error");
      document.getElementById("title_inform").innerHTML = "";
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
  function sendNews() {
    if (!isOnline()) {
      localStorage.setItem(`newsImg${number}`, img);
      localStorage.setItem(`newsTitle${number}`, titleVal);
      localStorage.setItem(`newsText${number}`, textVal);
      number++;
    } else {
      post(img, titleVal, textVal);
    }
  }
};

function reset() {
  form.reset();
  const alertDiv = document.getElementById("alertDiv");
  alertDiv.removeAttribute("class");
  const output = document.getElementById("output");
  output.setAttribute("src", "/images/downloading.png");
  const timer = 5000;
  setTimeout(() => {
    alertDiv.setAttribute("class", "hidden");
  }, timer);
}

function isOnline() {
  return window.navigator.onLine;
}

async function post(imgNews, newsTitle, newsText) {
  const url = "http://localhost:3000/news";
  const data = { img: imgNews, title: newsTitle, text: newsText };
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
