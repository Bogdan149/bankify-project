"use strict";

const account1 = {
  fullName: "Emily Johnson",
  userName: "EmilyJ",
  password: 12345,
  picture: "./imgs/emily-johnson.jpg",
  movements: [-1000, 10000, 25000, -5000, 50000, -15000, -10000, 100000],
};

const account2 = {
  fullName: "Michael Brown",
  userName: "MichaelB",
  password: 11111,
  picture: "./imgs/Michael Brown.jpg",
  movements: [
    -1000, 10000, 500000, -150000, -30000, 100000, -120000, 125000, 100000,
  ],
};

const account3 = {
  fullName: "Jane Smith",
  userName: "JaneS",
  password: 44444,
  picture: "./imgs/Jane Smith.jpg",
  movements: [
    -1000, 10000, 25000, -5000, 90000, -15000, -20000, 110000, -120000, 15000,
    460000,
  ],
};

const accounts = [account1, account2, account3];

// Modal window

const openBtn = document.querySelector(".open_btn");
const dialog = document.querySelector(".nav_open-account-dialog");
const closeBtn = dialog.querySelector(".close_btn");
const submitBtn = document.querySelector(".input_btn button");
const wrongInput = document.querySelector(".wrong_input");

openBtn.addEventListener("click", () => {
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

// Hamburger

const hamburger = document.querySelector(".btn_hamburger");
const hamburgeNav = document.querySelector(".hamburger_nav");
const hamburgerBars = document.querySelectorAll(".btn_hamburger .bar");
const navLinks = document.querySelectorAll(".hamburger_nav a");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("is-active");
  hamburgeNav.classList.toggle("inactive");

  hamburgerBars.style.color = "black";
});

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    hamburgeNav.classList.add("inactive");
    hamburger.classList.remove("is-active");
  });
});

// Logged IN

const loggedIn = () => {
  const userIntroduced = document.getElementById("user").value;
  const passwordIntroduced = document.getElementById("pass").value;

  let userValue = false;

  accounts.forEach((account) => {
    if (
      userIntroduced === account.userName &&
      passwordIntroduced == account.password
    ) {
      userValue = true;
      localStorage.setItem("loggedInUser", JSON.stringify(account));

      window.location.href = "dashboard.html";
    }
  });

  if (!userValue) {
    wrongInput.style.opacity = 1;
  }
};

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  loggedIn();
});

const inputs = [
  document.getElementById("user"),
  document.getElementById("pass"),
];
inputs.forEach((input) => {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      loggedIn();
    }
  });
});

// Lazy loading images

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    // Once the image is loaded, remove the 'lazy-img' class
    entry.target.addEventListener("load", () => {
      entry.target.classList.remove("lazy-img");
    });

    // Stop observing the current image (once it's loaded)
    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach((img) => imgObserver.observe(img));
