/* Daftar kota untuk jadwal sholat: [nama, lintang, bujur, zona (7=WIB, 8=WITA, 9=WIT)] */
const CITY_GROUPS=[
{g:"Aceh",c:[["Banda Aceh",5.55,95.32,7],["Lhokseumawe",5.18,97.15,7]]},
{g:"Sumatera Utara",c:[["Medan",3.595,98.672,7],["Pematangsiantar",2.96,99.06,7],["Sibolga",1.74,98.78,7],["Padangsidimpuan",1.37,99.27,7]]},
{g:"Sumatera Barat",c:[["Padang",-0.947,100.417,7],["Bukittinggi",-0.305,100.369,7]]},
{g:"Riau & Kepulauan Riau",c:[["Pekanbaru",0.507,101.447,7],["Dumai",1.67,101.45,7],["Batam",1.045,104.03,7],["Tanjungpinang",0.917,104.446,7]]},
{g:"Jambi, Bengkulu & Sumatera Selatan",c:[["Jambi",-1.61,103.61,7],["Bengkulu",-3.80,102.26,7],["Palembang",-2.976,104.775,7]]},
{g:"Bangka Belitung & Lampung",c:[["Pangkalpinang",-2.13,106.11,7],["Bandar Lampung",-5.45,105.266,7]]},
{g:"DKI Jakarta & Banten",c:[["Jakarta",-6.2,106.82,7],["Serang",-6.12,106.15,7],["Tangerang",-6.178,106.63,7],["Tangerang Selatan",-6.29,106.71,7],["Cilegon",-6.0,106.03,7]]},
{g:"Jawa Barat",c:[["Bandung",-6.917,107.619,7],["Bogor",-6.595,106.817,7],["Bekasi",-6.238,106.975,7],["Depok",-6.40,106.82,7],["Cirebon",-6.706,108.557,7],["Sukabumi",-6.92,106.93,7],["Tasikmalaya",-7.327,108.22,7],["Karawang",-6.32,107.34,7]]},
{g:"Jawa Tengah & DI Yogyakarta",c:[["Semarang",-6.966,110.42,7],["Surakarta (Solo)",-7.557,110.83,7],["Tegal",-6.87,109.14,7],["Pekalongan",-6.889,109.675,7],["Magelang",-7.47,110.22,7],["Purwokerto",-7.43,109.24,7],["Salatiga",-7.33,110.50,7],["Kudus",-6.80,110.84,7],["Cilacap",-7.72,109.01,7],["Yogyakarta",-7.797,110.37,7]]},
{g:"Jawa Timur",c:[["Surabaya",-7.2575,112.7521,7],["Malang",-7.98,112.63,7],["Sidoarjo",-7.45,112.72,7],["Kediri",-7.82,112.01,7],["Madiun",-7.63,111.52,7],["Jember",-8.17,113.70,7],["Banyuwangi",-8.22,114.37,7],["Probolinggo",-7.75,113.22,7],["Pasuruan",-7.645,112.907,7],["Blitar",-8.1,112.17,7]]},
{g:"Bali, NTB & NTT",c:[["Denpasar",-8.65,115.216,8],["Mataram",-8.583,116.116,8],["Bima",-8.46,118.73,8],["Kupang",-10.178,123.597,8],["Labuan Bajo",-8.497,119.888,8],["Maumere",-8.62,122.21,8]]},
{g:"Kalimantan",c:[["Pontianak",-0.027,109.343,7],["Singkawang",0.907,108.98,7],["Palangka Raya",-2.21,113.92,7],["Banjarmasin",-3.32,114.59,8],["Balikpapan",-1.265,116.83,8],["Samarinda",-0.50,117.15,8],["Bontang",0.13,117.5,8],["Tarakan",3.30,117.63,8],["Tanjung Selor",2.84,117.37,8]]},
{g:"Sulawesi",c:[["Manado",1.474,124.842,8],["Bitung",1.44,125.19,8],["Gorontalo",0.54,123.06,8],["Palu",-0.9,119.87,8],["Mamuju",-2.68,118.89,8],["Makassar",-5.147,119.433,8],["Parepare",-4.01,119.62,8],["Palopo",-2.99,120.20,8],["Kendari",-3.97,122.51,8],["Baubau",-5.47,122.63,8]]},
{g:"Maluku & Maluku Utara",c:[["Ambon",-3.695,128.18,9],["Ternate",0.79,127.38,9]]},
{g:"Papua",c:[["Jayapura",-2.53,140.72,9],["Manokwari",-0.86,134.06,9],["Sorong",-0.88,131.26,9],["Merauke",-8.49,140.40,9],["Timika",-4.54,136.89,9],["Wamena",-4.09,138.94,9]]}
];
const CITIES={};CITY_GROUPS.forEach(g=>g.c.forEach(([n,lat,lng,tz])=>CITIES[n]={lat,lng,tz}));
