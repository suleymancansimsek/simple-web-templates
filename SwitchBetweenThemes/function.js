const themeButton = document.getElementById('theme-button');
let currentTheme = 0;

const themes = [
  'theme-1',
  'theme-2',
  'theme-3',
  'theme-4'
];

function switchTheme() {
  document.body.className = themes[currentTheme];
  currentTheme = (currentTheme + 1) % themes.length;
}

themeButton.addEventListener('click', switchTheme);
