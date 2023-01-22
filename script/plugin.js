/* eslint-disable linebreak-style */
/* eslint-disable max-len */

// Comment utiliser le plugin ?
// Paramètres :

$.fn.parallaxe = function(options) {
  // Gestion des paramètres du plugin
  // Valeurs par défaut
  const defaut = {
    coeffDecalage: 0.2,
    offsetx: -150,
  };

  // Concatenation/ecrasement : remplace les propriétés de defaut par celles de option
  const parametres = $.extend(defaut, options);
  this.each(function(index) {
    const section = $(this);
    document.addEventListener('scroll', (e) => {
      posScrollY = window.scrollY;
      const calcPos = (section.offset().top - posScrollY)*parametres.coeffDecalage;
      section.css('background-position', `${parametres.offsetx + calcPos}px center`);
    });
  });

  return this;
};
