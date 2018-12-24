/*if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('sw.js');

    
}*/


  var url = window.location.href;
  var swLocation = '/espaciosmx/sw.js';
  
  var swReg;
  
  if ( navigator.serviceWorker ) {
  
  
      if ( url.includes('localhost') ) {
          swLocation = 'sw.js';
      }
  
  
      window.addEventListener('load', function() {
  
          navigator.serviceWorker.register( swLocation ).then( function(reg){
  
              swReg = reg;
              swReg.pushManager.getSubscription().then( verificaSuscripcion );
  
          });
  
      });
  
  }