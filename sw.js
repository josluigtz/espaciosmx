importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');
importScripts('views/js/sw-db.js');
importScripts('views/js/sw-utils.js');

const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'views/css/bootstrap.css',
    'images/icono.png',
    'php.ini',
    'favicon.png',
    'contenido.php',
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
    'views/js/sw-db.js',   
    'views/js/camara-class.js',    
    'views/js/script.js',    
    'views/js/sitio.js',      
    
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
    'views/js/tether.min.js',    
    'views/js/jquery.min.js',
    'views/js/owl.carousel.js',   
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

    let respuesta;

    if ( e.request.url.includes('/api') ) {

        // return respuesta????
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

    } else {

        respuesta = caches.match( e.request ).then( res => {

            if ( res ) {
                
                actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                return res;
                
            } else {
    
                return fetch( e.request ).then( newRes => {
    
                    return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
                });
    
            }
    
        });

    }

    e.respondWith( respuesta );

});


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if ( e.tag === 'nuevo-post' ) {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();
        
        e.waitUntil( respuesta );
    }

});

// Escuchar PUSH
self.addEventListener('push', e => {

    // console.log(e);

    const data = JSON.parse( e.data.text() );

    // console.log(data);


    const title = data.titulo;
    const options = {
        body: data.cuerpo,
        // icon: 'img/icons/icon-72x72.png',
        icon: `img/avatars/${ data.usuario }.jpg`,
        badge: 'img/favicon.ico',
        image: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/5/5b/Torre_de_los_Avengers.png/revision/latest?cb=20150626220613&path-prefix=es',
        vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
        openUrl: '/',
        data: {
            // url: 'https://google.com',
            url: '/',
            id: data.usuario
        },
        actions: [
            {
                action: 'thor-action',
                title: 'Thor',
                icon: 'img/avatar/thor.jpg'
            },
            {
                action: 'ironman-action',
                title: 'Ironman',
                icon: 'img/avatar/ironman.jpg'
            }
        ]
    };


    e.waitUntil( self.registration.showNotification( title, options) );


});


// Cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificación cerrada', e);
});


self.addEventListener('notificationclick', e => {


    const notificacion = e.notification;
    const accion = e.action;


    console.log({ notificacion, accion });
    // console.log(notificacion);
    // console.log(accion);
    

    const respuesta = clients.matchAll()
    .then( clientes => {

        let cliente = clientes.find( c => {
            return c.visibilityState === 'visible';
        });

        if ( cliente !== undefined ) {
            cliente.navigate( notificacion.data.url );
            cliente.focus();
        } else {
            clients.openWindow( notificacion.data.url );
        }

        return notificacion.close();

    });

    e.waitUntil( respuesta );


});
