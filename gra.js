document.addEventListener('DOMContentLoaded', () => {
    const plansza = document.getElementById('plansza');
    const komorki = document.querySelectorAll('.komorka');
    const statusGry = document.getElementById('status');
    const btnRestart = document.getElementById('btn-restart');

    const btn1Osoba = document.getElementById('btn-1osoba');
    const btn2Osoby = document.getElementById('btn-2osoby');
    const kontenerPoziomu = document.getElementById('poziom-kontener');
    const btnsPoziom = document.querySelectorAll('.btn-poziom');

    let stanGry = ['', '', '', '', '', '', '', '', ''];
    let aktywnyGracz = 'X'; // W trybie singleplayer gracz to zawsze X a bot to O
    let graTrwa = true;
    let tryb1Osoba = true;
    let poziomTrudnosci = 2; // 1: Łatwy, 2: Średni, 3: Trudny -> defaultowo średni

    const warunkiWygranej = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Wiersze
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolumny
        [0, 4, 8], [2, 4, 6]             // Przekątne
    ];

    // Konfiguracja trybów gry
    btn1Osoba.addEventListener('click', () => {
        tryb1Osoba = true;
        btn1Osoba.classList.add('aktywny');
        btn2Osoby.classList.remove('aktywny');
        kontenerPoziomu.style.display = 'flex';
        zresetujGre();
    });

    btn2Osoby.addEventListener('click', () => {
        tryb1Osoba = false;
        btn2Osoby.classList.add('aktywny');
        btn1Osoba.classList.remove('aktywny');
        kontenerPoziomu.style.display = 'none';
        zresetujGre();
    });

    btnsPoziom.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnsPoziom.forEach(b => b.classList.remove('aktywny'));
            e.target.classList.add('aktywny');
            poziomTrudnosci = parseInt(e.target.getAttribute('data-poziom'));
            zresetujGre();
        });
    });

    // Obsługa kliknięcia w komórkę
    function obslugaKlikniecia(e) {
        const kliknietaKomorka = e.target;
        const indeks = parseInt(kliknietaKomorka.getAttribute('data-indeks'));

        if (stanGry[indeks] !== '' || !graTrwa) return;

        // Zabezpieczenie na wypadek ruchu przed botem
        if (tryb1Osoba && aktywnyGracz === 'O') return;

        wykonajRuch(kliknietaKomorka, indeks, aktywnyGracz);

        if (graTrwa && tryb1Osoba && aktywnyGracz === 'O') {
            statusGry.textContent = 'Trwa ruch bota...';
            setTimeout(ruchBota, 500); // Tak żeby bot udawał że się zastanawia co robi
        }
    }

    function wykonajRuch(komorka, indeks, gracz) {
        stanGry[indeks] = gracz;
        komorka.textContent = gracz;
        komorka.classList.add('zajeta');

        // Zmiana koloru w zaleznosci od gracza
        komorka.style.color = gracz === 'X' ? '#2b6cb0' : '#e53e3e';

        sprawdzWynik();

        if (graTrwa) {
            aktywnyGracz = aktywnyGracz === 'X' ? 'O' : 'X';
            if (!(tryb1Osoba && aktywnyGracz === 'O')) {
                statusGry.textContent = `Kolej gracza: ${aktywnyGracz}`;
            }
        }
    }

    function ruchBota() {
        if (!graTrwa) return;

        let indeksRuchu = -1;
        const pusteIndeksy = stanGry.map((val, i) => val === '' ? i : null).filter(val => val !== null);

        if (pusteIndeksy.length === 0) return;

        // Poziom 1 - Losowy ruch
        if (poziomTrudnosci === 1) {
            indeksRuchu = pusteIndeksy[Math.floor(Math.random() * pusteIndeksy.length)];
        }
        // Poziom 2 i 3 - Bot (O) szuka wygrywającego ruchu
        else {
            indeksRuchu = znajdzNajlepszyRuch('O');

            // Na poziomie 2 i 3 bot blokuje gracza (X) jeśli ma on szansę wygrać
            if (indeksRuchu === -1 && (poziomTrudnosci === 2 || poziomTrudnosci === 3)) {
                indeksRuchu = znajdzNajlepszyRuch('X');
            }

            // Na poziomie 3 bot dodatkowo próbuje zajmować środek
            if (indeksRuchu === -1 && poziomTrudnosci === 3 && stanGry[4] === '') {
                indeksRuchu = 4;
            }

            // Domyślnie bot zajmuje losowe z pustych pól
            if (indeksRuchu === -1) {
                indeksRuchu = pusteIndeksy[Math.floor(Math.random() * pusteIndeksy.length)];
            }
        }

        const komorkaBota = document.querySelector(`.komorka[data-indeks="${indeksRuchu}"]`);
        wykonajRuch(komorkaBota, indeksRuchu, 'O');
    }

    // Funkcja pomocnicza dla bota szukająca brakujący element w linii
    function znajdzNajlepszyRuch(symbol) {
        for (let i = 0; i < warunkiWygranej.length; i++) {
            const [a, b, c] = warunkiWygranej[i];
            const linia = [stanGry[a], stanGry[b], stanGry[c]];

            // Sprawdzamy czy w linii są dwa takie same symbole i jedno puste miejsce
            if (linia.filter(s => s === symbol).length === 2 && linia.includes('')) {
                if (stanGry[a] === '') return a;
                if (stanGry[b] === '') return b;
                if (stanGry[c] === '') return c;
            }
        }
        return -1;
    }

    function sprawdzWynik() {
        let wygrana = false;
        let wygrywajacyWzklad = [];

        for (let i = 0; i < warunkiWygranej.length; i++) {
            const [a, b, c] = warunkiWygranej[i];
            if (stanGry[a] && stanGry[a] === stanGry[b] && stanGry[a] === stanGry[c]) {
                wygrana = true;
                wygrywajacyWzklad = [a, b, c];
                break;
            }
        }

        if (wygrana) {
            statusGry.textContent = `Wygrywa gracz: ${aktywnyGracz}!`;
            graTrwa = false;
            wygrywajacyWzklad.forEach(indeks => {
                document.querySelector(`.komorka[data-indeks="${indeks}"]`).classList.add('wygrana');
            });
            return;
        }

        if (!stanGry.includes('')) {
            statusGry.textContent = 'Remis!';
            graTrwa = false;
            return;
        }
    }

    function zresetujGre() {
        stanGry = ['', '', '', '', '', '', '', '', ''];
        aktywnyGracz = 'X';
        graTrwa = true;
        statusGry.textContent = `Kolej gracza: ${aktywnyGracz}`;

        komorki.forEach(komorka => {
            komorka.textContent = '';
            komorka.classList.remove('zajeta', 'wygrana');
            komorka.style.color = '#2d3748'; // reset koloru
        });
    }

    komorki.forEach(komorka => komorka.addEventListener('click', obslugaKlikniecia));
    btnRestart.addEventListener('click', zresetujGre);
});
