const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.href === window.location.href || link.pathname === window.location.pathname) {
    link.classList.add("active");
  }
});
/* =========================================
ACCESSIBILITY TOOLS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
const readButton = document.getElementById("read-page");
const pauseButton = document.getElementById("pause-reading");
const stopButton = document.getElementById("stop-reading");

const smallerButton = document.getElementById("text-smaller");
const resetButton = document.getElementById("text-reset");
const largerButton = document.getElementById("text-larger");

const html = document.documentElement;
const speech = window.speechSynthesis;

let currentTextSize = Number(
localStorage.getItem("preferredTextSize") || 0
);

function applyTextSize() {
html.classList.remove(
"text-size-large",
"text-size-extra-large"
);

if (currentTextSize === 1) {
html.classList.add("text-size-large");
}

if (currentTextSize === 2) {
html.classList.add("text-size-extra-large");
}

localStorage.setItem(
"preferredTextSize",
String(currentTextSize)
);
}

applyTextSize();

if (largerButton) {
largerButton.addEventListener("click", function () {
currentTextSize = Math.min(currentTextSize + 1, 2);
applyTextSize();
});
}

if (smallerButton) {
smallerButton.addEventListener("click", function () {
currentTextSize = Math.max(currentTextSize - 1, 0);
applyTextSize();
});
}

if (resetButton) {
resetButton.addEventListener("click", function () {
currentTextSize = 0;
applyTextSize();
});
}

if (readButton) {
readButton.addEventListener("click", function () {
if (!("speechSynthesis" in window)) {
alert("Text-to-speech is not supported in this browser.");
return;
}

speech.cancel();

const mainContent =
document.querySelector("main") ||
document.querySelector("#main") ||
document.body;

const pageText = mainContent.innerText
.replace(/\s+/g, " ")
.trim();

if (!pageText) {
return;
}

const message = new SpeechSynthesisUtterance(pageText);

message.lang = document.documentElement.lang || "en-CA";
message.rate = 0.95;
message.pitch = 1;

speech.speak(message);
});
}

if (pauseButton) {
pauseButton.addEventListener("click", function () {
if (!speech) {
return;
}

if (speech.paused) {
speech.resume();
pauseButton.textContent = "⏸ Pause";
pauseButton.setAttribute(
"aria-label",
"Pause reading"
);
} else if (speech.speaking) {
speech.pause();
pauseButton.textContent = "▶ Continue";
pauseButton.setAttribute(
"aria-label",
"Continue reading"
);
}
});
}

if (stopButton) {
stopButton.addEventListener("click", function () {
if (speech) {
speech.cancel();
}

if (pauseButton) {
pauseButton.textContent = "⏸ Pause";
pauseButton.setAttribute(
"aria-label",
"Pause or continue reading"
);
}
});
}

window.addEventListener("beforeunload", function () {
if (speech) {
speech.cancel();
}
});
});
