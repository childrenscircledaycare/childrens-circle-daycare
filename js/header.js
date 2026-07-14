document.addEventListener("DOMContentLoaded", async () => {
const headerPlaceholder = document.querySelector("#shared-header");

if (!headerPlaceholder) {
return;
}

try {
const response = await fetch("header.html");

if (!response.ok) {
throw new Error(`Header could not load: ${response.status}`);
}

headerPlaceholder.innerHTML = await response.text();

// Highlight the current page.
const currentPage =
window.location.pathname.split("/").pop() || "index.html";

const programPages = [
"sweetpeas.html",
"toddlers.html",
"hunnybears.html",
"sesames.html",
"kindergarten.html",
"coolcats.html",
"hotshots.html"
];

document
.querySelectorAll("#shared-header a")
.forEach((link) => {
const linkPage = link.getAttribute("href");

if (
linkPage === currentPage ||
(programPages.includes(currentPage) &&
linkPage === "programs.html")
) {
link.classList.add("active");
link.setAttribute("aria-current", "page");
}
});

// Mobile menu button.
const menuButton = document.querySelector(".nav-toggle");
const navigation = document.querySelector("#site-nav");

if (menuButton && navigation) {
menuButton.addEventListener("click", () => {
const isOpen =
menuButton.getAttribute("aria-expanded") === "true";

menuButton.setAttribute(
"aria-expanded",
String(!isOpen)
);

navigation.classList.toggle("open", !isOpen);
});
}

// More dropdown button for touch screens and keyboards.
const dropdown = document.querySelector(".nav-dropdown");
const dropdownButton =
document.querySelector(".dropdown-toggle");

if (dropdown && dropdownButton) {
dropdownButton.addEventListener("click", () => {
const isOpen =
dropdownButton.getAttribute("aria-expanded") === "true";

dropdownButton.setAttribute(
"aria-expanded",
String(!isOpen)
);

dropdown.classList.toggle("dropdown-open", !isOpen);
});
}
} catch (error) {
console.error(error);
headerPlaceholder.innerHTML =
"<p>Navigation could not be loaded.</p>";
}
});
