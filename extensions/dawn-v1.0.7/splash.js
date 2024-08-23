document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.local.get(['token'], function(result) {
    if (result.token !== undefined && result.token !== null && result.token !== "") {
      console.log('token currently is ' + result.token);
      window.location.href = 'dashboard.html';
    } else {
      console.log('token is not set');
      setTimeout(() => {
        window.location.href = 'onboarding.html';
      }, 2000);
     
    }
  });

  });
  