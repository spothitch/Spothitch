// Loader timeout fallback — shows "slow loading" message if app takes >8s
setTimeout(function() {
  var loader = document.getElementById('app-loader');
  var app = document.getElementById('app');
  if (loader && !loader.classList.contains('hidden') && (!app || !app.innerHTML)) {
    document.getElementById('loader-text').innerHTML =
      'Slow loading...<br><small style="color:#64748b">Check your connection</small>';
  }
}, 8000);
