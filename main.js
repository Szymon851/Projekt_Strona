/* Logika nawigacji, hamburger menu i scrollowanie na górę */

document.addEventListener('DOMContentLoaded', function () {

    /* Hamburger menu */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('otwarte');
        hamburger.classList.toggle('aktywny');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Zamknij menu po kliknięciu w link */
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('otwarte');
            hamburger.classList.remove('aktywny');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* Zamknij menu po kliknięciu poza nim */
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('otwarte');
            hamburger.classList.remove('aktywny');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    /* Podświetlanie aktywnej sekcji w nawigacji */
    var sections = document.querySelectorAll('header[id], section[id]');

    function updateActiveNav() {
        var scrollPos = window.scrollY;
        var currentSection = '';

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 100;
            var sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('aktywny');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('aktywny');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* Przycisk Przewiń do góry */
    var btnDoGory = document.getElementById('btn-do-gory');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            btnDoGory.classList.add('widoczny');
        } else {
            btnDoGory.classList.remove('widoczny');
        }
    });

    btnDoGory.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
