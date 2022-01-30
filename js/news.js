(() => {
  let img;
  let title;
  let text;
  if (Object.keys(localStorage).length !== 0) {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("news")
    );
    for (let i = 0; i < keys.length / 3; i++) {
      img = localStorage.getItem(`newsImg${i}`);
      title = localStorage.getItem(`newsTitle${i}`);
      text = localStorage.getItem(`newsText${i}`);
      post(img, title, text);
      localStorage.removeItem(`newsImg${i}`);
      localStorage.removeItem(`newsTitle${i}`);
      localStorage.removeItem(`newsText${i}`);
    }
  }
})();

function displayNews() {
  const newsDiv = document.getElementById("news_div");
  let img;
  let title;
  let text;
  let div;

  fetch("http://localhost:3000/news")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.forEach((element) => {
        div = document.createElement("div");
        div.setAttribute("class", "piece_of_news");
        img = element.img;
        title = element.title;
        text = element.text;
        div.innerHTML = `<img src="${img}" alt="news"><h3>${title}</h3><p>${text}</p>`;
        newsDiv.append(div);
      });
    });
}
displayNews();

function isOnline() {
  return window.navigator.onLine;
}



