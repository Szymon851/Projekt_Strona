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

    /* Konfiguracja API */
    const API_URL = 'https://projekt-strona-72e7.onrender.com';

    const configForm = document.getElementById('configurator-form');
    if (configForm) {
        let powerChartInstance = null; // Przechowuje wykres

        configForm.addEventListener('submit', async function (e) {
            e.preventDefault(); // Zapobiega przeładowaniu strony

            const cpu = document.getElementById('cpu-select').value;
            const gpu = document.getElementById('gpu-select').value;
            const ram = document.getElementById('ram-select').value;

            // Zmiana tekstu przycisku na czas ładowania
            const submitBtn = configForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Analizowanie...';
            submitBtn.disabled = true;

            try {
                // Asynchroniczne wywołanie API serwera
                const response = await fetch(`${API_URL}/api/calculate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ cpu, gpu, ram })
                });

                if (!response.ok) {
                    throw new Error('Błąd serwera. Sprawdź, czy serwer backendowy jest uruchomiony.');
                }

                const result = await response.json();

                if (result.success) {
                    const data = result.data.stats;
                    const chartData = result.data.chartData;

                    // Aktualizacja danych
                    document.getElementById('res-power').textContent = data.totalPower;
                    document.getElementById('res-psu').textContent = data.recommendedPSU;
                    document.getElementById('res-perf').textContent = data.performanceScore;
                    document.getElementById('res-bottleneck').textContent = data.bottleneck;
                    document.getElementById('res-price').textContent = data.totalPrice;

                    document.getElementById('config-results').style.display = 'block';

                    // Aktualizacja wykresu
                    const ctx = document.getElementById('powerChart').getContext('2d');

                    if (powerChartInstance) {
                        powerChartInstance.destroy(); // Usuwa stary wykres
                    }

                    powerChartInstance = new Chart(ctx, {
                        type: 'doughnut',
                        data: chartData,
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Podział poboru mocy'
                                }
                            }
                        }
                    });
                } else {
                    alert('Błąd podczas przetwarzania danych: ' + result.message);
                }

            } catch (error) {
                console.error('Błąd Fetch API:', error);
                alert('Nie udało się połączyć z serwerem. Upewnij się, że uruchomiłeś backend na porcie 3000!\n\nSzczegóły: ' + error.message);
            } finally {
                // Przywrócenie przycisku do stanu pierwotnego
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
