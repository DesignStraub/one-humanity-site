/* ==========================================================================
   artworks.data.js — the pictures in the art room of the 3D gallery.
   The single place to add artworks. Images go into img/art/ (resized,
   without EXIF/GPS). Everything is also on Instagram as @marcelloswigswag;
   "link" can point to the single post, otherwise the profile is used.

   {
     id: 'kurzer-name',
     src: 'img/art/datei.jpg', w: 1200, h: 1500,
     year: 2026,
     link: 'https://www.instagram.com/p/…/',          // optional
     de: { title: 'Titel', text: 'Ein, zwei Sätze.' },
     en: { title: 'Title', text: 'One or two sentences.' }
   }
   ========================================================================== */
window.OH_ARTWORKS_PROFILE = 'https://www.instagram.com/marcelloswigswag/';
window.OH_ARTWORKS = [];
