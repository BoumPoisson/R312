/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
$('section:nth-of-type(4)>div>img').slice(1).hide();

setInterval(() => {
  $('section:nth-of-type(4)>div>img')
      .first()
      .fadeOut('slow')
      .next()
      .fadeIn('slow')
      .end()
      .appendTo('section:nth-of-type(4)>div');
}, 3000);

// setInterval(() => {
//   $('section:nth-of-type(3)>div>img')
//       .first()
//       .fadeOut('slow')
//       .next()
//       .fadeIn('slow')
//       .end()
//       .appendTo('section:nth-of-type(3)>div');
// }, 3000);

$('section:nth-of-type(3)>div>img').slice(1).hide();
let i = 0;

$('section:nth-of-type(3)>div>nav>img:nth-of-type(1)').click(()=> {
  const j = (i + $('section:nth-of-type(3)>div>img').length - 1)%$('section:nth-of-type(3)>div>img').length;
  $('section:nth-of-type(3)>div>img')
      .eq(i)
      .fadeOut()
      .end()
      .eq(j)
      .fadeIn();
  i = j;
});
$('section:nth-of-type(3)>div>nav>img:nth-of-type(2)').click(()=> {
  const j = (i + 1)%$('section:nth-of-type(3)>div>img').length;
  $('section:nth-of-type(3)>div>img')
      .eq(i)
      .fadeOut()
      .end()
      .eq(j)
      .fadeIn();
  i = j;
});

// Variable globale contenant l'état du lecteur
let etatLecteur;

function lecteurPret(event) {
  // event.target = lecteur
  event.target.setVolume(50);
}

function changementLecteur(event) {
  // event.data = état du lecteur
  etatLecteur = event.data;
}

let lecteur;

function onYouTubeIframeAPIReady() {
  lecteur = new YT.Player('video', {
    height: '390',
    width: '640',
    videoId: 'n9xhJrPXop4',
    playerVars: {
      color: 'white',
      enablejsapi: 1,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: lecteurPret,
      onStateChange: changementLecteur,
    },
  });
}

// Hauteur de la vidéo
const hauteurVideo = $('#video').height();
// Position Y de la vidéo
const posYVideo = $('#video').offset().top;
// Valeur declenchant la modification de l'affichage (choix "esthétique")
const seuil = posYVideo + 0.75 * hauteurVideo;

// Gestion du défilement
$(window).scroll(function() {
  // Récupération de la valeur du défilement vertical
  const scroll = $(window).scrollTop();

  // Classe permettant l'exécution du CSS
  $('#video').toggleClass(
      'scroll',
      etatLecteur === YT.PlayerState.PLAYING && scroll > seuil,
  );
});

function distanceAngulaire(LatA, LatB, LongA, LongB) {
  const sinus = Math.sin((Math.PI/180)*LatA)* Math.sin((Math.PI/180)*LatB);
  const cosinus = Math.cos((Math.PI/180)*LatA) * Math.cos((Math.PI/180)*LatB);
  const cosinus2 = Math.cos((Math.PI/180)*LongB - (Math.PI/180)*LongA);
  const resultat = Math.acos(sinus + cosinus*cosinus2) * 6378.137;
  return resultat;
}

// RECUPERATION LOCALISATION

// Appelée si récupération des coordonnées réussie
function positionSucces(position) {
  // Injection du résultat dans du texte
  const lat = Math.round(1000 * position.coords.latitude) / 1000;
  const long = Math.round(1000 * position.coords.longitude) / 1000;
  map.flyTo([position.coords.latitude, position.coords.longitude], 12);

  L.geoJSON(villes, {
    filter: function(feature) {
      const test = distanceAngulaire(feature.geometry.coordinates[0], position.coords.latitude, feature.geometry.coordinates[1], position.coords.longitude);
      let ok = false;
      if (test<15000) {
        ok = true;
      }
      return ok;
    },
  }).addTo(map);
}

// Appelée si échec de récuparation des coordonnées
function positionErreur(erreurPosition) {
  // Cas d'usage du switch !
  let natureErreur;
  switch (erreurPosition.code) {
    case erreurPosition.TIMEOUT:
      // Attention, durée par défaut de récupération des coordonnées infini
      natureErreur = 'La géolocalisation prends trop de temps...';
      break;
    case erreurPosition.PERMISSION_DENIED:
      natureErreur = 'Vous n\'avez pas autorisé la géolocalisation.';
      break;
    case erreurPosition.POSITION_UNAVAILABLE:
      natureErreur = 'Votre position n\'a pu être déterminée.';
      break;
    default:
      natureErreur = 'Une erreur inattendue s\'est produite.';
  }
  // Injection du texte
  $('p').text(natureErreur);
}

// Récupération des coordonnées au clic sur le bouton
$('button').click(function() {
  // Support de la géolocalisation
  if ('geolocation' in navigator) {
    // Support = exécution du callback selon le résultat
    navigator.geolocation.getCurrentPosition(positionSucces, positionErreur, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000,
    });
  } else {
    // Non support = injection de texte
    $('p').text('La géolocalisation n\'est pas supportée par votre navigateur');
  }
});

// GESTION CARTE

// Création de la carte, vide à ce stade
const map = L.map('map', {
  center: [46.227638, 2.213749], // Centre de la France
  zoom: 5,
  minZoom: 2,
  maxZoom: 19,
});

// Ajout des tuiles (ici OpenStreetMap)
// https://wiki.openstreetmap.org/wiki/Tiles#Servers
L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(map);

// Ajout de l'échelle
L.control.scale().addTo(map);


$('section').parallaxe();

/* eslint-disable linebreak-style */

// Menu du casting en ajax et en cURL.
fetch('./script/cURL.php')
    .then((response) => response.json())
    .then((json) => {
      const cast = json.cast;
      $.each( cast, function( key, value ) {
        if (key <= 14) {
          const urlImage = 'https://image.tmdb.org/t/p/h632' + value.profile_path;
          $('#cast').append('<img id="' + value.id + '" src="' + urlImage + '">');
        }
      });

      $('#cast>img').click(function() {
        const infoUrl = './script/cURL2.php?msg=' + $(this).attr('id');
        fetch(infoUrl)
            .then((response) => response.json())
            .then((json) => {
              const urlImage = 'https://image.tmdb.org/t/p/h632' + json.profile_path;
              $('#info-cast').empty();
              $('#info-cast').show();
              $('#info-cast').append('<div> <img src="' + urlImage + '"> <div><h2>' + json.name + '</h2> <h4>' + json.birthday + '</h4> <h4>' + json.also_known_as[4] + '</h4> <h3>' + json.place_of_birth + '</h3> </div> </div><p>' + json.biography + '</p>');
            });
      });
    });

