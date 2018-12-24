// imports
importScripts('views/js/sw-utils.js');

const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
  //  '/',
    'index.html',
    'css/bootstrap.css',
    'php.ini',
    'favicon.ico',
    'index.php',
    'models/gestorSlide.php',
    'models/gestorArticulos.php',
    'models/gestorMensajes.php',
    'models/gestorGaleria.php',
    'controllers/template.php',
    'controllers/gestorSlide.php',
    'controllers/gestorArticulos.php',
    'controllers/gestorGaleria.php',
    'controllers/gestorMensajes.php',
    'views/css/iconeros.css',
    'views/css/revista.css',
    'views/css/style.css',
    'views/css/style.min.css',
    'views/template.php',
    'views/images/icono.png',
    'views/images/flecha.jpg',
    'views/images/espacios-app.png',
    'views/modules/cabezote.php',
    'views/modules/articuloModal.php',
    'views/modules/articulos.php',
    'views/modules/contactenos.php',
    'views/modules/galeria.php',
    'views/modules/iconeros.php',
    'views/modules/revista.php',
    'views/modules/slide.php',
    'views/modules/top.php',
    'views/modules/videos.php',  
    'views/js/app.js', 
    'views/js/sw-utils.js',
    
];

const APP_SHELL_INMUTABLE = [
    'views/css/bootstrap.min.css',
    'views/css/font-awesome.min.css',
    'https://use.fontawesome.com/releases/v5.6.1/css/all.css',
    'views/css/fonts.min.css',
    'views/css/cssFancybox/jquery.fancybox.css',
    'views/css/sweetalert.css',
    'views/js/jquery-2.2.0.min.js',
    'views/js/bootstrap.min.js',
    'views/js/jquery.fancybox.js',
    'views/js/animatescroll.js',
    'views/js/jquery.scrollUp.js',
    'views/js/sweetalert.min.js',
    'views/js/script.min.js',
   
];

self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });
    e.waitUntil( respuesta );

});



self.addEventListener( 'fetch', e => {


    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });



    e.respondWith( respuesta );

});

