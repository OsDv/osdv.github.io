const BODY= document.getElementsByTagName( 'body' )[0];
function toggleTheme() {
  console.log("toggleTheme")
  BODY.classList.toggle("dark-theme")
}
document.getElementById("theme-toggle-button").onclick = toggleTheme
