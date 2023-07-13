const themeButton = document.getElementById('theme-button');
let currentTheme = 0;

const themes = [
  {
    name: "Theme 1",
    bg: "#6528F7",
    btn: "#D7BBF5"
  },
  {
    name: "Theme 2",
    bg: "#071952",
    btn: "#35A29F"
  },
  {
    name: "Theme 3",
    bg: "#FFEADD",
    btn: "#FF6666"
  }
];

function switchTheme() {
  document.body.style.backgroundColor = themes[currentTheme].bg;
  themeButton.style.backgroundColor = themes[currentTheme].btn;
  themeButton.textContent = themes[currentTheme].name;
  currentTheme = (currentTheme + 1) % themes.length;
}

// Set initial theme
document.body.style.backgroundColor = themes[currentTheme].bg;
themeButton.style.backgroundColor = themes[currentTheme].btn;
themeButton.textContent = themes[currentTheme].name;

themeButton.addEventListener('click', switchTheme);
