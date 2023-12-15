const fs = require('fs');
const axios = require('axios');

function cekProxy(proxy) {
    /**
     * Fungsi untuk memeriksa apakah proxy dapat digunakan.
     * Mengembalikan Promise yang akan diselesaikan dengan true jika proxy dapat digunakan, false sebaliknya.
     */
    return axios.get('http://httpbin.org/ip', { proxy: { http: proxy, https: proxy }, timeout: 5000 })
        .then(response => response.status === 200)
        .catch(error => false);
}

function hapusProxyTidakBerfungsi(namaFile) {
    /**
     * Fungsi untuk menghapus proxy yang tidak dapat digunakan dari file.
     */
    const proxiesBaru = [];

    const proxies = fs.readFileSync(namaFile, 'utf-8').split('\n');

    async function cekDanHapusProxy() {
        for (const proxy of proxies) {
            const proxyTrimmed = proxy.trim();
            if (await cekProxy(proxyTrimmed)) {
                proxiesBaru.push(proxyTrimmed);
            } else {
                console.log(`Proxy tidak dapat digunakan: ${proxyTrimmed}`);
            }
        }

        fs.writeFileSync(namaFile, proxiesBaru.join('\n'));
    }

    cekDanHapusProxy();
}

// Ganti 'proxy.txt' dengan nama file yang sesuai
hapusProxyTidakBerfungsi('proxy.txt');
