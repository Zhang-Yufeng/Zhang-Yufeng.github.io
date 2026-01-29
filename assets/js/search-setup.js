<<<<<<< HEAD
let searchTheme = determineComputedTheme();
const ninjaKeys = document.querySelector("ninja-keys");

if (searchTheme === "dark") {
  ninjaKeys.classList.add("dark");
} else {
  ninjaKeys.classList.remove("dark");
}

const openSearchModal = () => {
  // collapse navbarNav if expanded on mobile
  const $navbarNav = $("#navbarNav");
  if ($navbarNav.hasClass("show")) {
    $navbarNav.collapse("hide");
  }
  ninjaKeys.open();
};
=======
let searchTheme=determineComputedTheme();const ninjaKeys=document.querySelector("ninja-keys");"dark"===searchTheme?ninjaKeys.classList.add("dark"):ninjaKeys.classList.remove("dark");const openSearchModal=()=>{const e=$("#navbarNav");e.hasClass("show")&&e.collapse("hide"),ninjaKeys.open()};
>>>>>>> 1ce95abf5eddd8c14d53977c9aafa0272127269c
