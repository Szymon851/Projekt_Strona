const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Baza komponentów
const componentsDB = {
    cpu: {
        'i5-12400f': { name: 'Intel Core i5-12400F', power: 65, performance: 75, price: 650 },
        'i7-13700k': { name: 'Intel Core i7-13700K', power: 125, performance: 95, price: 1800 },
        'r5-5600x': { name: 'AMD Ryzen 5 5600X', power: 65, performance: 70, price: 600 },
        'r7-7800x3d': { name: 'AMD Ryzen 7 7800X3D', power: 120, performance: 100, price: 1700 }
    },
    gpu: {
        'rtx-3060': { name: 'NVIDIA RTX 3060', power: 170, performance: 65, price: 1300 },
        'rtx-4070': { name: 'NVIDIA RTX 4070', power: 200, performance: 85, price: 2800 },
        'rx-6700xt': { name: 'AMD RX 6700 XT', power: 230, performance: 70, price: 1500 },
        'rx-7900xtx': { name: 'AMD RX 7900 XTX', power: 355, performance: 98, price: 4500 },
        'none': { name: 'Brak', power: 0, performance: 0, price: 0 }
    },
    ram: {
        '16gb-ddr4': { name: '16GB DDR4 3200MHz', power: 5, performance: 50, price: 180 },
        '32gb-ddr4': { name: '32GB DDR4 3600MHz', power: 8, performance: 70, price: 350 },
        '32gb-ddr5': { name: '32GB DDR5 6000MHz', power: 10, performance: 95, price: 500 }
    }
};

function analyzePC(cpuId, gpuId, ramId) {
    const cpu = componentsDB.cpu[cpuId];
    const gpu = componentsDB.gpu[gpuId];
    const ram = componentsDB.ram[ramId];

    if (!cpu || !gpu || !ram) {
        throw new Error('Nieprawidłowe ID podzespołu');
    }

    const totalPower = cpu.power + gpu.power + ram.power + 50; // +50W dla płyty i dysków
    const recommendedPSU = Math.ceil((totalPower * 1.3) / 50) * 50; // Zapasa 30%, zaokrąglenie do 50W

    const totalPrice = cpu.price + gpu.price + ram.price;

    // Sprawdzanie bottlenecka
    let bottleneck = 'Zestaw zbalansowany';
    let performanceScore = (cpu.performance + gpu.performance + ram.performance) / 3;

    if (cpu.performance > gpu.performance + 20) {
        bottleneck = 'Procesor jest za mocny dla tej karty graficznej (GPU Bottleneck)';
    } else if (gpu.performance > cpu.performance + 20) {
        bottleneck = 'Karta graficzna jest zbyt mocna dla tego procesora (CPU Bottleneck)';
    }

    return {
        components: {
            cpu: cpu.name,
            gpu: gpu.name,
            ram: ram.name
        },
        stats: {
            totalPower,
            recommendedPSU,
            totalPrice,
            bottleneck,
            performanceScore: Math.round(performanceScore)
        },
        // Dane do wykresu na frontendzie
        chartData: {
            labels: ['Pobór mocy CPU (W)', 'Pobór mocy GPU (W)', 'Pobór mocy RAM+Inne (W)'],
            datasets: [{
                label: 'Pobór mocy (W)',
                data: [cpu.power, gpu.power, ram.power + 50],
                backgroundColor: ['#2b6cb0', '#e53e3e', '#48bb78']
            }]
        }
    };
}

// Endpoint API
app.post('/api/calculate', (req, res) => {
    try {
        const { cpu, gpu, ram } = req.body;

        const result = analyzePC(cpu, gpu, ram);

        // Zwrócenie Widokowi odpowiedzi
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('API Konfiguratora PC działa poprawnie!');
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer MVC (Kontroler/Model) uruchomiony na porcie ${PORT}`);
});
