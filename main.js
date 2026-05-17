document.addEventListener('DOMContentLoaded', function () {
    var API_URL = 'https://projekt-strona-72e7.onrender.com';

    var PARTS = {
        cpu: {
            'i3-12100f': { name: 'Intel Core i3-12100F', group: 'Intel (LGA 1700)', power: 58, perf: 55, price: 400, socket: 'LGA1700', tdp: 89, brand: 'intel' },
            'i5-12400f': { name: 'Intel Core i5-12400F', group: 'Intel (LGA 1700)', power: 65, perf: 75, price: 650, socket: 'LGA1700', tdp: 117, brand: 'intel' },
            'i5-13600k': { name: 'Intel Core i5-13600K', group: 'Intel (LGA 1700)', power: 125, perf: 85, price: 1200, socket: 'LGA1700', tdp: 181, brand: 'intel' },
            'i7-13700k': { name: 'Intel Core i7-13700K', group: 'Intel (LGA 1700)', power: 125, perf: 95, price: 1800, socket: 'LGA1700', tdp: 253, brand: 'intel' },
            'i9-13900k': { name: 'Intel Core i9-13900K', group: 'Intel (LGA 1700)', power: 150, perf: 100, price: 2800, socket: 'LGA1700', tdp: 253, brand: 'intel' },
            'r5-5600x': { name: 'AMD Ryzen 5 5600X', group: 'AMD (AM4)', power: 65, perf: 70, price: 600, socket: 'AM4', tdp: 65, brand: 'amd' },
            'r7-5800x': { name: 'AMD Ryzen 7 5800X', group: 'AMD (AM4)', power: 105, perf: 80, price: 900, socket: 'AM4', tdp: 105, brand: 'amd' },
            'r5-7600x': { name: 'AMD Ryzen 5 7600X', group: 'AMD (AM5)', power: 105, perf: 78, price: 1000, socket: 'AM5', tdp: 105, brand: 'amd' },
            'r7-7800x3d': { name: 'AMD Ryzen 7 7800X3D', group: 'AMD (AM5)', power: 120, perf: 100, price: 1700, socket: 'AM5', tdp: 120, brand: 'amd' },
            'r9-7950x': { name: 'AMD Ryzen 9 7950X', group: 'AMD (AM5)', power: 170, perf: 100, price: 3200, socket: 'AM5', tdp: 170, brand: 'amd' }
        },
        mobo: {
            'b660-ddr4': { name: 'MSI PRO B660M-A (DDR4)', group: 'Intel LGA 1700 – DDR4', price: 450, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX', power: 30 },
            'b760-ddr4': { name: 'Gigabyte B760M DS3H (DDR4)', group: 'Intel LGA 1700 – DDR4', price: 500, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX', power: 30 },
            'z690-ddr5': { name: 'ASUS ROG Strix Z690-A (DDR5)', group: 'Intel LGA 1700 – DDR5', price: 1200, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', power: 40 },
            'z790-ddr5': { name: 'MSI MAG Z790 Tomahawk (DDR5)', group: 'Intel LGA 1700 – DDR5', price: 1500, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', power: 40 },
            'b550': { name: 'MSI MAG B550 Tomahawk (DDR4)', group: 'AMD AM4 – DDR4', price: 550, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', power: 30 },
            'x570': { name: 'ASUS TUF X570-Plus (DDR4)', group: 'AMD AM4 – DDR4', price: 800, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', power: 35 },
            'b650': { name: 'Gigabyte B650 Aorus Elite (DDR5)', group: 'AMD AM5 – DDR5', price: 900, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', power: 35 },
            'x670e': { name: 'ASUS ROG Crosshair X670E (DDR5)', group: 'AMD AM5 – DDR5', price: 2000, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', power: 45 }
        },
        gpu: {
            'gtx-1660s': { name: 'GTX 1660 Super', group: 'NVIDIA GeForce', power: 125, perf: 40, price: 800, minPsu: 450, brand: 'nvidia' },
            'rtx-3060': { name: 'RTX 3060 12GB', group: 'NVIDIA GeForce', power: 170, perf: 65, price: 1300, minPsu: 550, brand: 'nvidia' },
            'rtx-4060': { name: 'RTX 4060 8GB', group: 'NVIDIA GeForce', power: 115, perf: 70, price: 1500, minPsu: 550, brand: 'nvidia' },
            'rtx-4070': { name: 'RTX 4070 12GB', group: 'NVIDIA GeForce', power: 200, perf: 85, price: 2800, minPsu: 650, brand: 'nvidia' },
            'rtx-4070ti': { name: 'RTX 4070 Ti 16GB', group: 'NVIDIA GeForce', power: 285, perf: 90, price: 3800, minPsu: 700, brand: 'nvidia' },
            'rtx-4080': { name: 'RTX 4080 16GB', group: 'NVIDIA GeForce', power: 320, perf: 95, price: 5500, minPsu: 750, brand: 'nvidia' },
            'rtx-4090': { name: 'RTX 4090 24GB', group: 'NVIDIA GeForce', power: 450, perf: 100, price: 9000, minPsu: 850, brand: 'nvidia' },
            'rx-6600': { name: 'RX 6600 8GB', group: 'AMD Radeon', power: 132, perf: 45, price: 900, minPsu: 500, brand: 'amd' },
            'rx-6700xt': { name: 'RX 6700 XT 12GB', group: 'AMD Radeon', power: 230, perf: 70, price: 1500, minPsu: 650, brand: 'amd' },
            'rx-7800xt': { name: 'RX 7800 XT 16GB', group: 'AMD Radeon', power: 263, perf: 85, price: 2400, minPsu: 700, brand: 'amd' },
            'rx-7900xtx': { name: 'RX 7900 XTX 24GB', group: 'AMD Radeon', power: 355, perf: 98, price: 4500, minPsu: 800, brand: 'amd' },
            'none': { name: 'Zintegrowana (iGPU)', group: 'Bez karty', power: 0, perf: 0, price: 0, minPsu: 0, brand: 'all' }
        },
        ram: {
            '8gb-ddr4': { name: '8 GB (1x8) DDR4 3200 MHz', group: 'DDR4', power: 3, price: 80, type: 'DDR4' },
            '16gb-ddr4': { name: '16 GB (2x8) DDR4 3200 MHz', group: 'DDR4', power: 5, price: 180, type: 'DDR4' },
            '32gb-ddr4': { name: '32 GB (2x16) DDR4 3600 MHz', group: 'DDR4', power: 8, price: 350, type: 'DDR4' },
            '16gb-ddr5': { name: '16 GB (2x8) DDR5 5600 MHz', group: 'DDR5', power: 8, price: 280, type: 'DDR5' },
            '32gb-ddr5': { name: '32 GB (2x16) DDR5 6000 MHz', group: 'DDR5', power: 10, price: 500, type: 'DDR5' },
            '64gb-ddr5': { name: '64 GB (2x32) DDR5 6000 MHz', group: 'DDR5', power: 15, price: 950, type: 'DDR5' }
        },
        storage: {
            'nvme-500': { name: 'Samsung 980 500 GB NVMe', group: 'SSD NVMe M.2', power: 5, price: 200 },
            'nvme-1tb': { name: 'Samsung 970 EVO Plus 1 TB', group: 'SSD NVMe M.2', power: 6, price: 350 },
            'nvme-2tb': { name: 'WD Black SN850X 2 TB', group: 'SSD NVMe M.2', power: 7, price: 650 },
            'sata-500': { name: 'Crucial MX500 500 GB', group: 'SSD SATA 2.5"', power: 3, price: 150 },
            'sata-1tb': { name: 'Samsung 870 EVO 1 TB', group: 'SSD SATA 2.5"', power: 3, price: 280 },
            'hdd-1tb': { name: 'Seagate Barracuda 1 TB 7200rpm', group: 'HDD 3.5"', power: 8, price: 180 },
            'hdd-2tb': { name: 'Seagate Barracuda 2 TB 7200rpm', group: 'HDD 3.5"', power: 8, price: 250 }
        },
        cooling: {
            'stock': { name: 'Chłodzenie fabryczne (BOX)', group: 'Wentylator (Tower)', price: 0, maxTdp: 65, power: 5 },
            'tower-basic': { name: 'SilentiumPC Fera 5 (150W TDP)', group: 'Wentylator (Tower)', price: 120, maxTdp: 150, power: 5 },
            'tower-mid': { name: 'be quiet! Dark Rock 4 (200W TDP)', group: 'Wentylator (Tower)', price: 300, maxTdp: 200, power: 5 },
            'tower-top': { name: 'Noctua NH-D15 (250W TDP)', group: 'Wentylator (Tower)', price: 450, maxTdp: 250, power: 5 },
            'aio-240': { name: 'NZXT Kraken 240 (250W TDP)', group: 'Chłodzenie wodne (AIO)', price: 400, maxTdp: 250, power: 10 },
            'aio-280': { name: 'Arctic Liquid Freezer II 280 (300W TDP)', group: 'Chłodzenie wodne (AIO)', price: 500, maxTdp: 300, power: 10 },
            'aio-360': { name: 'Corsair iCUE H150i (350W TDP)', group: 'Chłodzenie wodne (AIO)', price: 650, maxTdp: 350, power: 15 }
        },
        pcCase: {
            'mini-1': { name: 'SilentiumPC Signum SG1 mATX', group: 'Mini Tower (mATX)', price: 200, maxForm: 'mATX', maxGpuLen: 320, maxCoolerH: 155 },
            'mini-2': { name: 'Cooler Master MasterBox Q300L', group: 'Mini Tower (mATX)', price: 180, maxForm: 'mATX', maxGpuLen: 360, maxCoolerH: 160 },
            'mid-1': { name: 'NZXT H5 Flow (ATX)', group: 'Mid Tower (ATX)', price: 400, maxForm: 'ATX', maxGpuLen: 365, maxCoolerH: 165 },
            'mid-2': { name: 'Fractal Design North (ATX)', group: 'Mid Tower (ATX)', price: 550, maxForm: 'ATX', maxGpuLen: 355, maxCoolerH: 170 },
            'mid-3': { name: 'Corsair 4000D Airflow (ATX)', group: 'Mid Tower (ATX)', price: 450, maxForm: 'ATX', maxGpuLen: 360, maxCoolerH: 170 },
            'full-1': { name: 'Corsair 7000D Airflow (E-ATX)', group: 'Full Tower (E-ATX)', price: 900, maxForm: 'EATX', maxGpuLen: 450, maxCoolerH: 190 }
        },
        psu: {
            '400': { name: 'be quiet! System Power 400W (80+ Bronze)', group: 'Do 500W', price: 150 },
            '500': { name: 'Corsair CV500 500W (80+ Bronze)', group: 'Do 500W', price: 200 },
            '550': { name: 'EVGA 550 G6 550W (80+ Gold)', group: '550W – 750W', price: 280 },
            '650': { name: 'Corsair RM650 650W (80+ Gold)', group: '550W – 750W', price: 350 },
            '750': { name: 'be quiet! Straight Power 12 750W (80+ Plat)', group: '550W – 750W', price: 500 },
            '850': { name: 'Corsair RM850x 850W (80+ Gold)', group: '850W+', price: 550 },
            '1000': { name: 'Seasonic Prime TX-1000 1000W (80+ Titan)', group: '850W+', price: 700 },
            '1200': { name: 'Corsair HX1200 1200W (80+ Platinum)', group: '850W+', price: 900 }
        }
    };

    var FORM_FITS = { 'mATX': 1, 'ATX': 2, 'EATX': 3 };

    // NAWIGACJA
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    var navLinks = document.querySelectorAll('.nav__link');

    hamburger.addEventListener('click', function () {
        var open = navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', open);
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // ===== SPA NAWIGACJA =====
    var views = document.querySelectorAll('.spa-view');
    function showView(id) {
        views.forEach(function (v) {
            if (v.id === id) { v.classList.add('active'); }
            else { v.classList.remove('active'); }
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
        window.scrollTo(0, 0); // Scroll do góry po przełączeniu strony
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('data-section');
            if (targetId) {
                showView(targetId);
            }
        });
    });

    // SCROLL TO TOP
    var btnTop = document.getElementById('btn-top');
    window.addEventListener('scroll', function () {
        btnTop.classList.toggle('visible', window.scrollY > 400);
    });
    btnTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // LIVE SUMMARY
    var selectors = {
        cpu: document.getElementById('cpu-select'),
        mobo: document.getElementById('mobo-select'),
        gpu: document.getElementById('gpu-select'),
        ram: document.getElementById('ram-select'),
        storage: document.getElementById('storage-select'),
        cooling: document.getElementById('cooling-select'),
        pcCase: document.getElementById('case-select'),
        psu: document.getElementById('psu-select')
    };

    function setCompat(id, text, status) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
        el.className = 'card__compat' + (status ? ' compat--' + status : '');
    }

    function updateLiveSummary() {
        var cpu = PARTS.cpu[selectors.cpu.value];
        var mobo = PARTS.mobo[selectors.mobo.value];
        var gpu = PARTS.gpu[selectors.gpu.value];
        var ram = PARTS.ram[selectors.ram.value];
        var storage = PARTS.storage[selectors.storage.value];
        var cooling = PARTS.cooling[selectors.cooling.value];
        var pcCase = PARTS.pcCase[selectors.pcCase.value];
        var psuW = parseInt(selectors.psu.value) || 0;

        var warnings = [];
        var hasAnySelected = cpu || mobo || gpu || ram || storage || cooling || pcCase || psuW > 0;
        var totalPower = hasAnySelected ? 50 : 0; // Tylko gdy coś jest, liczymy bazowe 50W
        var totalPrice = 0;

        if (cpu) { totalPower += cpu.power; totalPrice += cpu.price; }
        if (mobo) { totalPower += mobo.power; totalPrice += mobo.price; }
        if (gpu) { totalPower += gpu.power; totalPrice += gpu.price; }
        if (ram) { totalPower += ram.power; totalPrice += ram.price; }
        if (storage) { totalPower += storage.power; totalPrice += storage.price; }
        if (cooling) { totalPower += cooling.power; totalPrice += cooling.price; }
        if (pcCase) { totalPrice += pcCase.price; }

        var psuPrices = { 400: 150, 500: 200, 550: 280, 650: 350, 750: 500, 850: 550, 1000: 700, 1200: 900 };
        if (psuW && psuPrices[psuW]) totalPrice += psuPrices[psuW];

        if (hasAnySelected) {
            var recPsu = Math.ceil((totalPower * 1.3) / 50) * 50;
            document.getElementById('live-power').textContent = totalPower + ' W';
            document.getElementById('live-rec-psu').textContent = recPsu + ' W';
            document.getElementById('live-price').textContent = totalPrice + ' PLN';
        } else {
            document.getElementById('live-power').textContent = '—';
            document.getElementById('live-rec-psu').textContent = '—';
            document.getElementById('live-price').textContent = '—';
        }

        if (cpu && mobo) {
            if (cpu.socket === mobo.socket) {
                setCompat('compat-cpu', '✓ ' + cpu.socket, 'ok');
                setCompat('compat-mobo', '✓ ' + mobo.socket, 'ok');
                document.getElementById('live-socket').textContent = '✓ ' + cpu.socket;
                document.getElementById('live-socket').className = 'summary__value ok';
            } else {
                setCompat('compat-cpu', '✗ ' + cpu.socket, 'error');
                setCompat('compat-mobo', '✗ ' + mobo.socket, 'error');
                document.getElementById('live-socket').textContent = '✗ Niezgodne!';
                document.getElementById('live-socket').className = 'summary__value error';
                warnings.push('🚫 CPU (' + cpu.socket + ') nie pasuje do płyty (' + mobo.socket + ')!');
            }
        } else {
            setCompat('compat-cpu', ''); setCompat('compat-mobo', '');
            document.getElementById('live-socket').textContent = '—';
            document.getElementById('live-socket').className = 'summary__value';
        }

        if (ram && mobo) {
            if (ram.type === mobo.ramType) {
                setCompat('compat-ram', '✓ ' + ram.type, 'ok');
                document.getElementById('live-ramtype').textContent = '✓ ' + ram.type;
                document.getElementById('live-ramtype').className = 'summary__value ok';
            } else {
                setCompat('compat-ram', '✗ ' + ram.type + '!', 'error');
                document.getElementById('live-ramtype').textContent = '✗ Niezgodne!';
                document.getElementById('live-ramtype').className = 'summary__value error';
                warnings.push('🚫 RAM (' + ram.type + ') nie pasuje do płyty (' + mobo.ramType + ')!');
            }
        } else {
            setCompat('compat-ram', '');
            document.getElementById('live-ramtype').textContent = '—';
            document.getElementById('live-ramtype').className = 'summary__value';
        }

        if (cpu && cooling) {
            if (cooling.maxTdp >= cpu.tdp) {
                setCompat('compat-cooling', '✓ OK (' + cooling.maxTdp + 'W)', 'ok');
                document.getElementById('live-cooling').textContent = '✓ OK';
                document.getElementById('live-cooling').className = 'summary__value ok';
            } else {
                setCompat('compat-cooling', '✗ Za słabe!', 'error');
                document.getElementById('live-cooling').textContent = '✗ Za słabe!';
                document.getElementById('live-cooling').className = 'summary__value error';
                warnings.push('🚫 Chłodzenie (' + cooling.maxTdp + 'W TDP) za słabe dla CPU (' + cpu.tdp + 'W TDP)!');
            }
        } else {
            setCompat('compat-cooling', '');
            document.getElementById('live-cooling').textContent = '—';
            document.getElementById('live-cooling').className = 'summary__value';
        }

        if (mobo && pcCase) {
            var moboSize = FORM_FITS[mobo.formFactor] || 0;
            var caseSize = FORM_FITS[pcCase.maxForm] || 0;
            if (caseSize >= moboSize) {
                setCompat('compat-case', '✓ Pasuje', 'ok');
                document.getElementById('live-casefit').textContent = '✓ OK';
                document.getElementById('live-casefit').className = 'summary__value ok';
            } else {
                setCompat('compat-case', '✗ Za mała!', 'error');
                document.getElementById('live-casefit').textContent = '✗ Za mała!';
                document.getElementById('live-casefit').className = 'summary__value error';
                warnings.push('🚫 Obudowa (' + pcCase.maxForm + ') za mała na płytę (' + mobo.formFactor + ')!');
            }
        } else {
            setCompat('compat-case', '');
            document.getElementById('live-casefit').textContent = '—';
            document.getElementById('live-casefit').className = 'summary__value';
        }

        var psuEl = document.getElementById('live-psu-status');
        if (psuW > 0) {
            if (psuW >= recPsu) {
                psuEl.textContent = '✓ OK'; psuEl.className = 'summary__value ok';
                setCompat('compat-psu', '✓ OK', 'ok');
            } else if (psuW >= totalPower) {
                psuEl.textContent = '⚠ Mały zapas'; psuEl.className = 'summary__value warn';
                setCompat('compat-psu', '⚠ Mały zapas', 'warn');
                warnings.push('⚠ Zasilacz ma mały zapas mocy. Zalecane min. ' + recPsu + ' W.');
            } else {
                psuEl.textContent = '✗ Za słaby!'; psuEl.className = 'summary__value error';
                setCompat('compat-psu', '✗ Za słaby!', 'error');
                warnings.push('🚫 Zasilacz (' + psuW + 'W) za słaby! System wymaga min. ' + totalPower + ' W.');
            }
            if (gpu && gpu.minPsu && psuW < gpu.minPsu) {
                warnings.push('🚫 GPU wymaga zasilacza min. ' + gpu.minPsu + ' W!');
                setCompat('compat-gpu', '⚠ PSU min. ' + gpu.minPsu + 'W', 'warn');
            } else if (gpu && gpu.minPsu) {
                setCompat('compat-gpu', '✓ OK', 'ok');
            }
        } else {
            psuEl.textContent = 'Wybierz PSU'; psuEl.className = 'summary__value';
            setCompat('compat-psu', ''); setCompat('compat-gpu', '');
        }

        document.getElementById('live-warnings').innerHTML = warnings.join('<br>');
    }

    // SYSTEM FILTROWANIA
    var autoFilter = document.getElementById('auto-filter');
    var filterBtns = document.querySelectorAll('.filter-btn');
    var activeBrandFilters = { 'cpu-brand': 'all', 'gpu-brand': 'all' };

    // Dynamiczne budowanie opcji
    var originalOptions = {};
    Object.keys(PARTS).forEach(function (category) {
        var opts = [];
        Object.keys(PARTS[category]).forEach(function (key) {
            var item = PARTS[category][key];
            opts.push({ value: key, text: item.name, group: item.group || '' });
        });
        originalOptions[category] = opts;
    });

    // Inicjalizacja opcji na starcie
    setTimeout(applyFilters, 0);

    function getCpuBrand(id) {
        if (!id) return '';
        return id.match(/^(i\d|i\d)/) ? 'intel' : 'amd';
    }

    function getGpuBrand(id) {
        if (!id || id === 'none') return 'all';
        return id.match(/^(rtx|gtx)/) ? 'nvidia' : 'amd';
    }

    function rebuildSelect(sel, key, allowedValues) {
        var currentVal = sel.value;
        var opts = originalOptions[key];
        var groups = {};

        // Wyczyść select i dodaj opcję domyślną
        sel.innerHTML = '<option value="">— Wybierz —</option>';

        opts.forEach(function (o) {
            if (o.value === '' || allowedValues === null || allowedValues.indexOf(o.value) !== -1) {
                if (o.group && o.group !== '') {
                    if (!groups[o.group]) {
                        groups[o.group] = document.createElement('optgroup');
                        groups[o.group].label = o.group;
                        sel.appendChild(groups[o.group]);
                    }
                    var opt = new Option(o.text, o.value);
                    groups[o.group].appendChild(opt);
                } else {
                    sel.appendChild(new Option(o.text, o.value));
                }
            }
        });

        // Usuń puste optgroupy
        var optgroups = sel.querySelectorAll('optgroup');
        optgroups.forEach(function (g) { if (g.children.length === 0) g.remove(); });

        // Przywróć poprzednią wartość jeśli nadal dostępna
        var found = false;
        for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === currentVal) { found = true; break; }
        }
        sel.value = found ? currentVal : '';
    }

    function applyFilters() {
        var isAutoFilter = autoFilter.checked;
        var cpuBrand = activeBrandFilters['cpu-brand'];
        var gpuBrand = activeBrandFilters['gpu-brand'];

        var selectedCpu = PARTS.cpu[selectors.cpu.value];
        var selectedMobo = PARTS.mobo[selectors.mobo.value];
        var selectedRam = PARTS.ram[selectors.ram.value];

        // Filtruj CPU
        var allowedCpu = [];
        Object.keys(PARTS.cpu).forEach(function (id) {
            var brand = getCpuBrand(id);
            if (cpuBrand !== 'all' && brand !== cpuBrand) return;
            if (isAutoFilter && selectedMobo && PARTS.cpu[id].socket !== selectedMobo.socket) return;
            allowedCpu.push(id);
        });
        rebuildSelect(selectors.cpu, 'cpu', allowedCpu);

        // Filtruj płyty główne
        var allowedMobo = [];
        Object.keys(PARTS.mobo).forEach(function (id) {
            var mobo = PARTS.mobo[id];
            if (isAutoFilter && selectedCpu && mobo.socket !== selectedCpu.socket) return;
            if (isAutoFilter && selectedRam && mobo.ramType !== selectedRam.type) return;
            allowedMobo.push(id);
        });
        rebuildSelect(selectors.mobo, 'mobo', allowedMobo);

        // Filtruj GPU
        var allowedGpu = [];
        Object.keys(PARTS.gpu).forEach(function (id) {
            if (id === 'none') { allowedGpu.push(id); return; }
            var brand = getGpuBrand(id);
            if (gpuBrand !== 'all' && brand !== gpuBrand) return;
            allowedGpu.push(id);
        });
        rebuildSelect(selectors.gpu, 'gpu', allowedGpu);

        // Filtruj RAM
        var allowedRam = [];
        Object.keys(PARTS.ram).forEach(function (id) {
            if (isAutoFilter && selectedMobo && PARTS.ram[id].type !== selectedMobo.ramType) return;
            allowedRam.push(id);
        });
        rebuildSelect(selectors.ram, 'ram', allowedRam);

        // Filtruj chłodzenie (pokaż tylko te co dadzą radę z wybranym CPU)
        var allowedCooling = [];
        var curCpu = PARTS.cpu[selectors.cpu.value];
        Object.keys(PARTS.cooling).forEach(function (id) {
            if (isAutoFilter && curCpu && PARTS.cooling[id].maxTdp < curCpu.tdp) return;
            allowedCooling.push(id);
        });
        rebuildSelect(selectors.cooling, 'cooling', allowedCooling);

        // Filtruj obudowę (pokaż tylko te co zmieszczą wybraną płytę)
        var allowedCase = [];
        var curMobo = PARTS.mobo[selectors.mobo.value];
        Object.keys(PARTS.pcCase).forEach(function (id) {
            if (isAutoFilter && curMobo) {
                var moboSize = FORM_FITS[curMobo.formFactor] || 0;
                var caseSize = FORM_FITS[PARTS.pcCase[id].maxForm] || 0;
                if (caseSize < moboSize) return;
            }
            allowedCase.push(id);
        });
        rebuildSelect(selectors.pcCase, 'pcCase', allowedCase);

        // Storage i PSU bez filtrowania kompatybilności
        rebuildSelect(selectors.storage, 'storage', null);
        rebuildSelect(selectors.psu, 'psu', null);

        updateLiveSummary();
    }

    // Obsługa toggle
    autoFilter.addEventListener('change', applyFilters);

    // Obsługa przycisków filtrów marek
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filterGroup = btn.getAttribute('data-filter');
            var value = btn.getAttribute('data-value');
            activeBrandFilters[filterGroup] = value;

            // Przełącz klasę active w grupie
            document.querySelectorAll('.filter-btn[data-filter="' + filterGroup + '"]').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            applyFilters();
        });
    });

    // Przy zmianie komponentu filtruj i aktualizuj podsumowanie
    Object.values(selectors).forEach(function (sel) {
        sel.addEventListener('change', function () {
            applyFilters();
        });
    });

    // ANALIZA NA SERWERZE
    var btnAnalyze = document.getElementById('btn-analyze');

    btnAnalyze.addEventListener('click', async function () {
        var cpu = selectors.cpu.value;
        var gpu = selectors.gpu.value;
        var ram = selectors.ram.value;
        if (!cpu || !gpu || !ram) {
            alert('Wybierz przynajmniej CPU, GPU i RAM przed analizą.');
            return;
        }
        btnAnalyze.textContent = 'Analizowanie…';
        btnAnalyze.disabled = true;
        try {
            var res = await fetch(API_URL + '/api/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cpu: cpu,
                    gpu: gpu,
                    ram: ram,
                    mobo: selectors.mobo.value,
                    storage: selectors.storage.value,
                    cooling: selectors.cooling.value,
                    pcCase: selectors.pcCase.value,
                    psu: selectors.psu.value
                })
            });
            if (!res.ok) throw new Error('Serwer: ' + res.status);
            var json = await res.json();
            if (json.success) {
                var d = json.data;
                document.getElementById('res-power').textContent = d.stats.totalPower + ' W';
                document.getElementById('res-psu').textContent = d.stats.recommendedPSU + ' W';
                document.getElementById('res-perf').textContent = d.stats.performanceScore + '/100';
                document.getElementById('res-price').textContent = d.stats.totalPrice + ' PLN';
                var bnEl = document.getElementById('res-bottleneck');
                bnEl.textContent = d.stats.bottleneck;
                bnEl.className = 'results__bottleneck ' + (d.stats.bottleneck.includes('zbalansowany') ? 'balanced' : 'warning');
                document.getElementById('server-results').classList.add('visible');
                var pb = document.getElementById('power-bar');
                var pl = document.getElementById('power-legend');
                pb.innerHTML = ''; pl.innerHTML = '';
                var colors = ['#6c63ff', '#f87171', '#34d399'];
                var total = d.chartData.datasets[0].data.reduce(function (a, b) { return a + b }, 0);
                d.chartData.labels.forEach(function (label, i) {
                    var val = d.chartData.datasets[0].data[i];
                    if (val <= 0) return;
                    var pct = (val / total * 100).toFixed(1) + '%';
                    pb.innerHTML += '<div style="width:' + pct + '; background:' + colors[i] + '; display:flex; align-items:center; justify-content:center; color:white; font-size:11px;" title="' + label + ': ' + val + 'W">' + val + 'W</div>';
                    pl.innerHTML += '<div style="display:flex; align-items:center; gap:5px;"><span style="display:inline-block; width:12px; height:12px; background:' + colors[i] + '; border-radius:3px;"></span>' + label + '</div>';
                });
            } else { alert('Błąd: ' + json.message); }
        } catch (err) {
            alert('Nie udało się połączyć z serwerem.\n' + err.message);
        } finally {
            btnAnalyze.textContent = 'Analizuj na serwerze ⚡';
            btnAnalyze.disabled = false;
        }
    });

    // WALIDACJA FORMULARZA
    var REGEX = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        zip: /^\d{2}-\d{3}$/,
        phone: /^(\+?48\s?)?\d{3}\s?\d{3}\s?\d{3}$/
    };

    var orderForm = document.getElementById('order-form');
    var nameInput = document.getElementById('order-name');
    var emailInput = document.getElementById('order-email');
    var zipInput = document.getElementById('order-zip');
    var phoneInput = document.getElementById('order-phone');

    function validateField(input, errorId, rule) {
        var errEl = document.getElementById(errorId);
        var msg = '';
        if (input.hasAttribute('required') && !input.value.trim()) {
            msg = 'To pole jest wymagane.';
        } else if (rule && input.value.trim() && !rule.test(input.value.trim())) {
            if (errorId === 'error-email') msg = 'Nieprawidłowy format e-mail.';
            else if (errorId === 'error-zip') msg = 'Wymagany format: XX-XXX.';
            else if (errorId === 'error-phone') msg = 'Nieprawidłowy numer telefonu.';
        }
        if (msg) {
            input.classList.add('invalid'); input.classList.remove('valid');
            errEl.textContent = msg; return false;
        }
        if (input.value.trim()) { input.classList.add('valid'); input.classList.remove('invalid'); }
        else { input.classList.remove('valid', 'invalid'); }
        errEl.textContent = ''; return true;
    }

    nameInput.addEventListener('input', function () { validateField(nameInput, 'error-name'); });
    emailInput.addEventListener('input', function () { validateField(emailInput, 'error-email', REGEX.email); });
    zipInput.addEventListener('input', function () { validateField(zipInput, 'error-zip', REGEX.zip); });
    phoneInput.addEventListener('input', function () { validateField(phoneInput, 'error-phone', REGEX.phone); });

    orderForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        var conf = document.getElementById('order-confirmation');
        conf.className = 'order-confirmation'; conf.textContent = '';

        var v1 = validateField(nameInput, 'error-name');
        var v2 = validateField(emailInput, 'error-email', REGEX.email);
        var v3 = validateField(zipInput, 'error-zip', REGEX.zip);
        var v4 = validateField(phoneInput, 'error-phone', REGEX.phone);
        if (!v1 || !v2 || !v3) return;
        if (phoneInput.value.trim() && !v4) return;

        var cpu = PARTS.cpu[selectors.cpu.value];
        var gpu = PARTS.gpu[selectors.gpu.value];
        var ram = PARTS.ram[selectors.ram.value];
        var psuW = parseInt(selectors.psu.value) || 0;
        if (!cpu || !gpu || !ram || !psuW) {
            conf.className = 'order-confirmation error';
            conf.textContent = 'Najpierw skonfiguruj kompletny zestaw (CPU, GPU, RAM, PSU).';
            return;
        }
        var totalPower = cpu.power + gpu.power + ram.power + 50;
        if (psuW < totalPower) {
            conf.className = 'order-confirmation error';
            conf.textContent = '🚫 Zasilacz (' + psuW + 'W) za słaby! Min. ' + totalPower + 'W. Zmień zasilacz.';
            return;
        }

        var btnOrder = document.getElementById('btn-order');
        btnOrder.textContent = 'Wysyłanie…'; btnOrder.disabled = true;
        try {
            var res = await fetch(API_URL + '/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(), email: emailInput.value.trim(),
                    zip: zipInput.value.trim(), phone: phoneInput.value.trim(),
                    config: {
                        cpu: selectors.cpu.value, gpu: selectors.gpu.value,
                        ram: selectors.ram.value, psu: selectors.psu.value
                    }
                })
            });
            var json = await res.json();
            if (json.success) {
                conf.className = 'order-confirmation success';
                conf.textContent = '✓ ' + json.message;
                orderForm.reset();
                document.querySelectorAll('.form-input').forEach(function (i) { i.classList.remove('valid', 'invalid'); });
                document.querySelectorAll('.form-error').forEach(function (e) { e.textContent = ''; });
            } else {
                conf.className = 'order-confirmation error';
                conf.textContent = '✗ ' + (json.errors ? json.errors.join(' | ') : json.message);
            }
        } catch (err) {
            conf.className = 'order-confirmation error';
            conf.textContent = 'Błąd połączenia: ' + err.message;
        } finally {
            btnOrder.textContent = 'Złóż zamówienie ✓'; btnOrder.disabled = false;
        }
    });

});
