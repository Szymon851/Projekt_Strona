/**
 * Moduł Tłumaczenia – wielojęzyczność strony.
 *
 * System tłumaczeń oparty na zewnętrznych plikach zasobów JSON (lang/*.json).
 * Dodanie nowego języka wymaga jedynie utworzenia nowego pliku JSON
 * w katalogu lang/ i dodania wpisu do DOSTEPNE_JEZYKI.
 */
var Tlumaczenia = (function () {
    'use strict';

    // Dostępne języki – aby dodać nowy, wystarczy dodać wpis i plik lang/<kod>.json
    var DOSTEPNE_JEZYKI = ['pl', 'en'];
    var DOMYSLNY_JEZYK = 'pl';

    var slowniki = {};
    var obecnyJezyk = DOMYSLNY_JEZYK;
    var nasluchiwacze = [];

    /**
     * Pobiera plik JSON z tłumaczeniami dla danego języka.
     */
    function pobierzJezyk(kodJezyka) {
        return new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            script.src = 'lang/' + kodJezyka + '.js';
            script.onload = function() {
                if (window.TlumaczeniaDanych && window.TlumaczeniaDanych[kodJezyka]) {
                    slowniki[kodJezyka] = window.TlumaczeniaDanych[kodJezyka];
                    resolve(slowniki[kodJezyka]);
                } else {
                    reject(new Error('Brak danych w lang/' + kodJezyka + '.js'));
                }
            };
            script.onerror = function() {
                reject(new Error('Nie udało się załadować: lang/' + kodJezyka + '.js'));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Zwraca przetłumaczony tekst dla danego klucza.
     * Obsługuje parametry w formacie {0}, {1}, ...
     */
    function pobierzTekst(klucz) {
        var argumenty = Array.prototype.slice.call(arguments, 1);
        var slownik = slowniki[obecnyJezyk] || slowniki[DOMYSLNY_JEZYK] || {};
        var tekst = slownik[klucz] || klucz;
        // Zamiana {0}, {1}, … na argumenty
        for (var i = 0; i < argumenty.length; i++) {
            tekst = tekst.replace('{' + i + '}', argumenty[i]);
        }
        return tekst;
    }

    /**
     * Ustawia język i aktualizuje DOM.
     */
    function ustawJezyk(kodJezyka) {
        if (DOSTEPNE_JEZYKI.indexOf(kodJezyka) === -1) kodJezyka = DOMYSLNY_JEZYK;

        var zastosuj = function () {
            obecnyJezyk = kodJezyka;
            document.documentElement.lang = kodJezyka;
            localStorage.setItem('pcbuilder-lang', kodJezyka);
            zastosujTlumaczenia();
            aktualizujPrzelacznikJezyka();
            // Powiadom nasłuchujących
            nasluchiwacze.forEach(function (fn) { fn(kodJezyka); });
        };

        if (slowniki[kodJezyka]) {
            zastosuj();
        } else {
            pobierzJezyk(kodJezyka).then(zastosuj);
        }
    }

    /**
     * Nadaje treść elementom z atrybutem data-i18n.
     */
    function zastosujTlumaczenia() {
        var elementy = document.querySelectorAll('[data-i18n]');
        elementy.forEach(function (el) {
            var klucz = el.getAttribute('data-i18n');
            var tekst = pobierzTekst(klucz);

            // Sprawdź, czy tekst zawiera HTML (<strong>, itp.)
            if (tekst.indexOf('<') !== -1 && tekst.indexOf('>') !== -1) {
                el.innerHTML = tekst;
            } else {
                el.textContent = tekst;
            }
        });

        // data-i18n-placeholder
        var placeholdery = document.querySelectorAll('[data-i18n-placeholder]');
        placeholdery.forEach(function (el) {
            el.placeholder = pobierzTekst(el.getAttribute('data-i18n-placeholder'));
        });

        // data-i18n-aria
        var elementyAria = document.querySelectorAll('[data-i18n-aria]');
        elementyAria.forEach(function (el) {
            el.setAttribute('aria-label', pobierzTekst(el.getAttribute('data-i18n-aria')));
        });

        // data-i18n-title (atrybut title)
        var elementyTitle = document.querySelectorAll('[data-i18n-title]');
        elementyTitle.forEach(function (el) {
            el.title = pobierzTekst(el.getAttribute('data-i18n-title'));
        });

        // Aktualizuj <title> i <meta description>
        document.title = pobierzTekst('page_title');
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', pobierzTekst('meta_description'));
    }

    /**
     * Aktualizuje widoczny stan przełącznika języka.
     */
    function aktualizujPrzelacznikJezyka() {
        var przyciski = document.querySelectorAll('.lang-btn');
        przyciski.forEach(function (btn) {
            var jezyk = btn.getAttribute('data-lang');
            btn.classList.toggle('active', jezyk === obecnyJezyk);
        });
    }

    /**
     * Rejestruje callback wywoływany po zmianie języka.
     */
    function poZmianieJezyka(fn) {
        nasluchiwacze.push(fn);
    }

    /**
     * Inicjalizacja systemu tłumaczeń.
     */
    function zainicjuj() {
        // Odczytaj preferowany język z localStorage lub domyślny
        var zapisany = localStorage.getItem('pcbuilder-lang');
        var startowyJezyk = zapisany && DOSTEPNE_JEZYKI.indexOf(zapisany) !== -1 ? zapisany : DOMYSLNY_JEZYK;

        // Ładuj oba języki na start, by przełączanie było natychmiastowe
        var obietnice = DOSTEPNE_JEZYKI.map(function (kod) { return pobierzJezyk(kod); });

        // Obsługa przycisków przełącznika - poza then, aby działało nawet przy błędzie pierwszego ładowania
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.lang-btn');
            if (btn) {
                var jezyk = btn.getAttribute('data-lang');
                ustawJezyk(jezyk);
            }
        });

        return Promise.all(obietnice).then(function () {
            ustawJezyk(startowyJezyk);
        }).catch(function(e) {
            console.error("Błąd ładowania języków:", e);
        });
    }

    // Publiczne API modułu
    return {
        zainicjuj: zainicjuj,
        pobierzTekst: pobierzTekst,
        ustawJezyk: ustawJezyk,
        pobierzObecnyJezyk: function () { return obecnyJezyk; },
        poZmianieJezyka: poZmianieJezyka,
        DOSTEPNE_JEZYKI: DOSTEPNE_JEZYKI
    };
})();
