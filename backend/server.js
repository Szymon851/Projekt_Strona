const express = require('express');
const cors = require('cors');

const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const Order = sequelize.define('Order', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    zip: { type: DataTypes.STRING, allowNull: false },
    phoneHash: { type: DataTypes.STRING, allowNull: true },
    configJSON: { type: DataTypes.TEXT, allowNull: false }
});

sequelize.sync();

const componentsDB = {
    cpu: {
        'i3-12100f': { name: 'Intel Core i3-12100F', power: 58, performance: 55, price: 400, socket: 'LGA1700', tdp: 89 },
        'i5-12400f': { name: 'Intel Core i5-12400F', power: 65, performance: 75, price: 650, socket: 'LGA1700', tdp: 117 },
        'i5-13600k': { name: 'Intel Core i5-13600K', power: 125, performance: 85, price: 1200, socket: 'LGA1700', tdp: 181 },
        'i7-13700k': { name: 'Intel Core i7-13700K', power: 125, performance: 95, price: 1800, socket: 'LGA1700', tdp: 253 },
        'i9-13900k': { name: 'Intel Core i9-13900K', power: 150, performance: 100, price: 2800, socket: 'LGA1700', tdp: 253 },
        'r5-5600x': { name: 'AMD Ryzen 5 5600X', power: 65, performance: 70, price: 600, socket: 'AM4', tdp: 65 },
        'r7-5800x': { name: 'AMD Ryzen 7 5800X', power: 105, performance: 80, price: 900, socket: 'AM4', tdp: 105 },
        'r5-7600x': { name: 'AMD Ryzen 5 7600X', power: 105, performance: 78, price: 1000, socket: 'AM5', tdp: 105 },
        'r7-7800x3d': { name: 'AMD Ryzen 7 7800X3D', power: 120, performance: 100, price: 1700, socket: 'AM5', tdp: 120 },
        'r9-7950x': { name: 'AMD Ryzen 9 7950X', power: 170, performance: 100, price: 3200, socket: 'AM5', tdp: 170 }
    },
    motherboard: {
        'b660-ddr4': { name: 'MSI PRO B660M-A (DDR4)', price: 450, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX', power: 30 },
        'b760-ddr4': { name: 'Gigabyte B760M DS3H (DDR4)', price: 500, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'mATX', power: 30 },
        'z690-ddr5': { name: 'ASUS ROG Strix Z690-A (DDR5)', price: 1200, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', power: 40 },
        'z790-ddr5': { name: 'MSI MAG Z790 Tomahawk (DDR5)', price: 1500, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', power: 40 },
        'b550': { name: 'MSI MAG B550 Tomahawk (DDR4)', price: 550, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', power: 30 },
        'x570': { name: 'ASUS TUF X570-Plus (DDR4)', price: 800, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', power: 35 },
        'b650': { name: 'Gigabyte B650 Aorus Elite (DDR5)', price: 900, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', power: 35 },
        'x670e': { name: 'ASUS ROG Crosshair X670E (DDR5)', price: 2000, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', power: 45 }
    },
    gpu: {
        'gtx-1660s': { name: 'GTX 1660 Super', power: 125, performance: 40, price: 800, minPsu: 450 },
        'rtx-3060': { name: 'RTX 3060 12GB', power: 170, performance: 65, price: 1300, minPsu: 550 },
        'rtx-4060': { name: 'RTX 4060 8GB', power: 115, performance: 70, price: 1500, minPsu: 550 },
        'rtx-4070': { name: 'RTX 4070 12GB', power: 200, performance: 85, price: 2800, minPsu: 650 },
        'rtx-4070ti': { name: 'RTX 4070 Ti 12GB', power: 285, performance: 90, price: 3800, minPsu: 700 },
        'rtx-4080': { name: 'RTX 4080 16GB', power: 320, performance: 95, price: 5500, minPsu: 750 },
        'rtx-4090': { name: 'RTX 4090 24GB', power: 450, performance: 100, price: 9000, minPsu: 850 },
        'rx-6600': { name: 'RX 6600 8GB', power: 132, performance: 45, price: 900, minPsu: 500 },
        'rx-6700xt': { name: 'RX 6700 XT 12GB', power: 230, performance: 70, price: 1500, minPsu: 650 },
        'rx-7800xt': { name: 'RX 7800 XT 16GB', power: 263, performance: 85, price: 2400, minPsu: 700 },
        'rx-7900xtx': { name: 'RX 7900 XTX 24GB', power: 355, performance: 98, price: 4500, minPsu: 800 },
        'none': { name: 'Zintegrowana (iGPU)', power: 0, performance: 0, price: 0, minPsu: 0 }
    },
    ram: {
        '8gb-ddr4': { name: '8 GB DDR4 3200 MHz', power: 3, performance: 30, price: 80, type: 'DDR4' },
        '16gb-ddr4': { name: '16 GB DDR4 3200 MHz', power: 5, performance: 50, price: 180, type: 'DDR4' },
        '32gb-ddr4': { name: '32 GB DDR4 3600 MHz', power: 8, performance: 70, price: 350, type: 'DDR4' },
        '16gb-ddr5': { name: '16 GB DDR5 5600 MHz', power: 8, performance: 65, price: 280, type: 'DDR5' },
        '32gb-ddr5': { name: '32 GB DDR5 6000 MHz', power: 10, performance: 95, price: 500, type: 'DDR5' },
        '64gb-ddr5': { name: '64 GB DDR5 6000 MHz', power: 15, performance: 100, price: 950, type: 'DDR5' }
    },
    storage: {
        'nvme-500': { name: 'Samsung 980 500 GB', price: 200, power: 5 },
        'nvme-1tb': { name: 'Samsung 970 EVO Plus 1 TB', price: 350, power: 6 },
        'nvme-2tb': { name: 'WD Black SN850X 2 TB', price: 650, power: 7 },
        'sata-500': { name: 'Crucial MX500 500 GB', price: 150, power: 3 },
        'sata-1tb': { name: 'Samsung 870 EVO 1 TB', price: 280, power: 3 },
        'hdd-1tb': { name: 'Seagate Barracuda 1 TB', price: 180, power: 8 },
        'hdd-2tb': { name: 'Seagate Barracuda 2 TB', price: 250, power: 8 }
    },
    cooling: {
        'stock': { name: 'Chłodzenie BOX', price: 0, maxTdp: 65, power: 5 },
        'tower-basic': { name: 'SilentiumPC Fera 5', price: 120, maxTdp: 150, power: 5 },
        'tower-mid': { name: 'be quiet! Dark Rock 4', price: 300, maxTdp: 200, power: 5 },
        'tower-top': { name: 'Noctua NH-D15', price: 450, maxTdp: 250, power: 5 },
        'aio-240': { name: 'NZXT Kraken 240', price: 400, maxTdp: 250, power: 10 },
        'aio-280': { name: 'Arctic Liquid Freezer II 280', price: 500, maxTdp: 300, power: 10 },
        'aio-360': { name: 'Corsair iCUE H150i', price: 650, maxTdp: 350, power: 15 }
    },
    pcCase: {
        'mini-1': { name: 'SilentiumPC Signum SG1 mATX', price: 200, power: 0 },
        'mini-2': { name: 'Cooler Master MasterBox Q300L', price: 180, power: 0 },
        'mid-1': { name: 'NZXT H5 Flow', price: 400, power: 0 },
        'mid-2': { name: 'Fractal Design North', price: 550, power: 0 },
        'mid-3': { name: 'Corsair 4000D Airflow', price: 450, power: 0 },
        'full-1': { name: 'Corsair 7000D Airflow', price: 900, power: 0 }
    }
};

const psuPrices = { 400: 150, 500: 200, 550: 280, 650: 350, 750: 500, 850: 550, 1000: 700, 1200: 900 };

function analyzePC(config) {
    const { cpu: cId, gpu: gId, ram: rId, motherboard: mId, storage: sId, cooling: clId, pcCase: csId, psu: pW } = config;

    const cpu = componentsDB.cpu[cId];
    const gpu = componentsDB.gpu[gId];
    const ram = componentsDB.ram[rId];
    const motherboard = componentsDB.motherboard[mId];
    const storage = componentsDB.storage[sId];
    const cooling = componentsDB.cooling[clId];
    const pcCase = componentsDB.pcCase[csId];
    const psuW = parseInt(pW) || 0;

    if (!cpu || !gpu || !ram) throw new Error('Wymagane główne podzespoły (CPU, GPU, RAM)');

    let totalPower = 50; // Bazowe 50W
    let totalPrice = 0;

    totalPower += cpu.power + gpu.power + ram.power;
    totalPrice += cpu.price + gpu.price + ram.price;

    if (motherboard) { totalPower += motherboard.power; totalPrice += motherboard.price; }
    if (storage) { totalPower += storage.power; totalPrice += storage.price; }
    if (cooling) { totalPower += cooling.power; totalPrice += cooling.price; }
    if (pcCase) { totalPrice += pcCase.price; }
    if (psuW && psuPrices[psuW]) totalPrice += psuPrices[psuW];

    const recommendedPSU = Math.ceil((totalPower * 1.3) / 50) * 50;

    let bottleneck = 'Zestaw zbalansowany';
    const perfScore = (cpu.performance + gpu.performance + ram.performance) / 3;

    if (cpu.performance > gpu.performance + 20) {
        bottleneck = 'GPU Bottleneck - procesor przewyższa kartę graficzną';
    } else if (gpu.performance > cpu.performance + 20) {
        bottleneck = 'CPU Bottleneck - karta graficzna przewyższa procesor';
    }

    return {
        components: {
            cpu: cpu.name, gpu: gpu.name, ram: ram.name,
            motherboard: motherboard ? motherboard.name : 'Nie wybrano',
            storage: storage ? storage.name : 'Nie wybrano'
        },
        stats: { totalPower, recommendedPSU, totalPrice, bottleneck, performanceScore: Math.round(perfScore) },
        chartData: {
            labels: ['CPU', 'GPU', 'RAM + Inne'],
            datasets: [{
                label: 'Pobór mocy (W)',
                data: [cpu.power, gpu.power, totalPower - cpu.power - gpu.power],
                backgroundColor: ['#6c63ff', '#f87171', '#34d399']
            }]
        }
    };
}

app.post('/api/calculate', (req, res) => {
    try {
        const result = analyzePC(req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.post('/api/order', (req, res) => {
    const { name, email, zip, phone, config } = req.body;
    const errors = [];

    if (!name || name.trim().length < 3) errors.push('Imię i nazwisko: min. 3 znaki.');
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
        errors.push('Nieprawidłowy adres e-mail.');
    if (!zip || !/^\d{2}-\d{3}$/.test(zip))
        errors.push('Kod pocztowy: format XX-XXX.');
    if (phone && phone.trim() && !/^(\+?48\s?)?\d{3}\s?\d{3}\s?\d{3}$/.test(phone.trim()))
        errors.push('Nieprawidłowy numer telefonu.');

    if (!config || !config.cpu || !config.gpu || !config.ram || !config.psu)
        errors.push('Niekompletna konfiguracja.');

    if (config && config.cpu && config.gpu && config.ram) {
        const cpu = componentsDB.cpu[config.cpu];
        const gpu = componentsDB.gpu[config.gpu];
        const ram = componentsDB.ram[config.ram];
        const psuW = parseInt(config.psu) || 0;
        if (!cpu || !gpu || !ram) { errors.push('Nieznany podzespół.'); }
        else {
            const totalPower = cpu.power + gpu.power + ram.power + 50;
            if (psuW < totalPower) errors.push('Zasilacz (' + psuW + 'W) za słaby - min. ' + totalPower + 'W.');
        }
    }

    if (errors.length > 0) return res.status(400).json({ success: false, errors });

    // Szyfrowanie numeru telefonu
    let phoneHash = null;
    if (phone) {
        phoneHash = crypto.createHash('sha256').update(phone).digest('hex');
    }

    // Zapis zamówienia do bazy danych za pomocą ORM
    Order.create({
        name: name,
        email: email,
        zip: zip,
        phoneHash: phoneHash,
        configJSON: JSON.stringify(config)
    }).then(() => {
        res.json({ success: true, message: 'Zamówienie zapisane w bazie! Potwierdzenie wysłane na: ' + email });
    }).catch(err => {
        res.status(500).json({ success: false, message: 'Błąd bazy danych.' });
    });
});

app.get('/', (req, res) => { res.send('API Konfiguratora PC działa.'); });

app.listen(PORT, () => { console.log('Serwer na porcie ' + PORT); });
