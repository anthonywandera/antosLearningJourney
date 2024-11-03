"use strict";

const items = document.querySelectorAll(".item");
const accordion = document.querySelector(".accordion");

// open item on click
function openItem(e) {
  if (!e.target.classList.contains("text")) return;
  items.forEach((item) => {
    item.classList.remove("open");
  });

  e.target.closest(".item").classList.add("open");
}

// event handler
accordion.addEventListener("click", openItem);
