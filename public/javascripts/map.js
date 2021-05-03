var map = L.map('main_map').setView([11.2299618,-74.2110185],20);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([11.229973, -74.210850]).addTo(map);
L.marker([11.229952, -74.211000]).addTo(map);
L.marker([11.229839, -74.211024]).addTo(map);