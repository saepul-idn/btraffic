const fs = require('fs');
const axios = require('axios');

// Baca daftar proxy dari file proxy.txt
const proxyList = fs.readFileSync('./proxy.txt', 'utf-8').split('\n').map(proxy => proxy.trim());

// Baca daftar agent pengguna dari file agent.txt
const agentList = fs.readFileSync('./agent.txt', 'utf-8').split('\n').map(agent => agent.trim());

// Fungsi untuk mengambil nilai acak dari daftar
function getRandomValue(list) {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

// Fungsi untuk membuat permintaan dengan proxy dan agent pengguna acak
function makeRequest(url, attempts = 3) {
  const randomProxy = getRandomValue(proxyList);
  const randomAgent = getRandomValue(agentList);

  axios.get(url, {
    proxy: {
      host: randomProxy.split(':')[0],
      port: randomProxy.split(':')[1],
    },
    headers: {
      'User-Agent': randomAgent,
    },
  })
    .then(response => {
      console.log('Lokasi pengalihan pertama:', response.request.res.responseUrl);
      console.log('Data respons akhir:', response.data);
    })
    .catch(error => {
      console.error('Error:', error.message);

      // Coba lagi jika masih ada upaya tersisa
      if (attempts > 0) {
        console.log(`Mencoba lagi. Upaya tersisa: ${attempts}`);
        makeRequest(url, attempts - 1);
      } else {
        console.log('Upaya habis. Tidak dapat melanjutkan permintaan.');
      }
    });
}


// Contoh penggunaan
const targetUrl = 'https://sharelinkidn.blogspot.com/2023/12/payload-ssh-websocket-example.html';
makeRequest(targetUrl);
