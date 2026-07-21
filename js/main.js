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
ACCESSIBILITY DROPDOWN AND TOOLS
========================================= */

document.addEventListener("DOMContentLoaded", function () {
const html = document.documentElement;

const menuToggle = document.getElementById("accessibility-toggle");
const menuPanel = document.getElementById("accessibility-panel");
const closeButton = document.getElementById("accessibility-close");

const readButton = document.getElementById("read-page");
const pauseButton = document.getElementById("pause-reading");
const stopButton = document.getElementById("stop-reading");

const smallerButton = document.getElementById("text-smaller");
const resetButton = document.getElementById("text-reset");
const largerButton = document.getElementById("text-larger");

const contrastButton = document.getElementById("contrast-toggle");

const speechSupported = "speechSynthesis" in window;
const speech = speechSupported ? window.speechSynthesis : null;

let currentTextSize = Number(
localStorage.getItem("preferredTextSize") || 0
);

let highContrast =
localStorage.getItem("highContrast") === "true";

/* Open and close accessibility menu */

function openAccessibilityMenu() {
if (!menuPanel || !menuToggle) {
return;
}

menuPanel.hidden = false;
menuToggle.setAttribute("aria-expanded", "true");

const firstFocusableElement = menuPanel.querySelector(
"button, a, input, select, textarea"
);

if (firstFocusableElement) {
firstFocusableElement.focus();
}
}

function closeAccessibilityMenu(returnFocus = true) {
if (!menuPanel || !menuToggle) {
return;
}

menuPanel.hidden = true;
menuToggle.setAttribute("aria-expanded", "false");

if (returnFocus) {
menuToggle.focus();
}
}

if (menuToggle) {
menuToggle.addEventListener("click", function () {
const isOpen =
menuToggle.getAttribute("aria-expanded") === "true";

if (isOpen) {
closeAccessibilityMenu(false);
} else {
openAccessibilityMenu();
}
});
}

if (closeButton) {
closeButton.addEventListener("click", function () {
closeAccessibilityMenu();
});
}

document.addEventListener("keydown", function (event) {
if (
event.key === "Escape" &&
menuPanel &&
!menuPanel.hidden
) {
closeAccessibilityMenu();
}
});

document.addEventListener("click", function (event) {
if (
menuPanel &&
menuToggle &&
!menuPanel.hidden &&
!menuPanel.contains(event.target) &&
!menuToggle.contains(event.target)
) {
closeAccessibilityMenu(false);
}
});

/* Text-size controls */

function applyTextSize() {
html.classList.remove(
"text-size-small",
"text-size-large",
"text-size-extra-large"
);

if (currentTextSize === -1) {
html.classList.add("text-size-small");
}

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

if (smallerButton) {
smallerButton.addEventListener("click", function () {
currentTextSize = Math.max(currentTextSize - 1, -1);
applyTextSize();
});
}

if (resetButton) {
resetButton.addEventListener("click", function () {
currentTextSize = 0;
applyTextSize();
});
}

if (largerButton) {
largerButton.addEventListener("click", function () {
currentTextSize = Math.min(currentTextSize + 1, 2);
applyTextSize();
});
}

/* High-contrast mode */

function applyHighContrast() {
html.classList.toggle("high-contrast", highContrast);

if (!contrastButton) {
return;
}

contrastButton.setAttribute(
"aria-pressed",
String(highContrast)
);

contrastButton.innerHTML = highContrast
? '<span aria-hidden="true">◐</span> Turn Off High Contrast'
: '<span aria-hidden="true">◐</span> Turn On High Contrast';

localStorage.setItem(
"highContrast",
String(highContrast)
);
}

applyHighContrast();

if (contrastButton) {
contrastButton.addEventListener("click", function () {
highContrast = !highContrast;
applyHighContrast();
});
}

/* Read-page-aloud controls */

function resetPauseButton() {
if (!pauseButton) {
return;
}

pauseButton.innerHTML =
'<span aria-hidden="true">⏸</span> Pause';

pauseButton.setAttribute(
"aria-label",
"Pause reading"
);
}

function getReadablePageText() {
const mainContent =
document.querySelector("main") ||
document.querySelector("#main");

if (!mainContent) {
return "";
}

const readableCopy = mainContent.cloneNode(true);

readableCopy
.querySelectorAll(
"script, style, noscript, .accessibility-menu, [aria-hidden='true']"
)
.forEach(function (element) {
element.remove();
});

return readableCopy.innerText
.replace(/\s+/g, " ")
.trim();
}

if (!speechSupported) {
[readButton, pauseButton, stopButton].forEach(
function (button) {
if (button) {
button.disabled = true;
}
}
);
}

if (readButton) {
readButton.addEventListener("click", function () {
if (!speechSupported) {
alert(
"Read-aloud is not supported in this browser."
);
return;
}

speech.cancel();
resetPauseButton();

const pageText = getReadablePageText();

if (!pageText) {
alert("No readable page content was found.");
return;
}

const message =
new SpeechSynthesisUtterance(pageText);

message.lang =
document.documentElement.lang || "en-CA";

message.rate = 0.95;
message.pitch = 1;

message.addEventListener("end", resetPauseButton);
message.addEventListener("error", resetPauseButton);

speech.speak(message);
});
}

if (pauseButton) {
pauseButton.addEventListener("click", function () {
if (!speechSupported) {
return;
}

if (speech.paused) {
speech.resume();

pauseButton.innerHTML =
'<span aria-hidden="true">⏸</span> Pause';

pauseButton.setAttribute(
"aria-label",
"Pause reading"
);
} else if (speech.speaking) {
speech.pause();

pauseButton.innerHTML =
'<span aria-hidden="true">▶</span> Continue';

pauseButton.setAttribute(
"aria-label",
"Continue reading"
);
}
});
}

if (stopButton) {
stopButton.addEventListener("click", function () {
if (!speechSupported) {
return;
}

speech.cancel();
resetPauseButton();
});
}

window.addEventListener("beforeunload", function () {
if (speechSupported) {
speech.cancel();
}
});
});
