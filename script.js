window.onhashchange = function(e) {
  urlEditada = e.newURL.split('#')[0];
  e.newURL = urlEditada
  console.log(e.newURL);
}