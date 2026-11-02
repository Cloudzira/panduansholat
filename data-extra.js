/* Materi tambahan. Nomor hadis mengikuti sunnah.com; verifikasi takhrij sebelum dipublikasikan sebagai panduan final. */
const WUDHU=[
{t:"Niat dalam hati",d:"Berniat berwudhu untuk sholat atau ibadah lain. Niat tempatnya di hati, tidak perlu dilafalkan.",s:"HR. al-Bukhari 1"},
{t:"Membaca basmalah dan mencuci telapak tangan",d:"Ucapkan bismillah, lalu cuci kedua telapak tangan tiga kali.",s:"HR. al-Bukhari 159, Muslim 226"},
{t:"Berkumur dan istinsyaq",d:"Berkumur dan menghirup air ke hidung, lalu mengeluarkannya, tiga kali. Boleh dengan satu cidukan air.",s:"HR. al-Bukhari 159"},
{t:"Membasuh wajah",d:"Basuh seluruh wajah tiga kali, dari tempat tumbuh rambut kepala sampai bawah dagu, dan dari telinga ke telinga.",s:"QS. Al-Ma'idah 5:6"},
{t:"Membasuh tangan sampai siku",d:"Basuh tangan kanan lalu kiri sampai siku, tiga kali, termasuk sela-sela jari.",s:"QS. Al-Ma'idah 5:6; HR. Muslim 226"},
{t:"Mengusap kepala dan telinga",d:"Usap seluruh kepala satu kali dari depan ke belakang lalu kembali ke depan, kemudian usap telinga (bagian dalam dengan telunjuk, luar dengan ibu jari).",s:"HR. al-Bukhari 185, Abu Dawud 135"},
{t:"Membasuh kaki sampai mata kaki",d:"Basuh kaki kanan lalu kiri sampai mata kaki, tiga kali, sambil menyela jari-jari kaki.",s:"QS. Al-Ma'idah 5:6"},
{t:"Tertib dan membaca doa",d:"Lakukan berurutan tanpa jeda panjang. Setelah selesai, baca doa setelah wudhu.",s:"HR. Muslim 234",ar:"أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",lt:"Asyhadu an lā ilāha illallāh waḥdahū lā syarīka lah, wa asyhadu anna Muḥammadan ‘abduhū wa rasūluh.",m:"Aku bersaksi tiada tuhan selain Allah semata, tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya."}];
const TAYAMMUM=[
{t:"Pastikan boleh bertayammum",d:"Tayammum berlaku saat tidak ada air, air tidak terjangkau, atau memakainya membahayakan (misalnya sakit). Masuknya waktu sholat dan upaya mencari air lebih dulu perlu diperhatikan.",s:"QS. An-Nisa' 4:43, Al-Ma'idah 5:6"},
{t:"Niat dalam hati",d:"Berniat tayammum untuk menghilangkan hadas agar boleh sholat.",s:"HR. al-Bukhari 1"},
{t:"Menepuk tanah yang suci",d:"Bismillah, lalu tepukkan kedua telapak tangan satu kali ke tanah, debu, atau permukaan yang berdebu dan suci.",s:"HR. al-Bukhari 338, Muslim 368"},
{t:"Meniup debu berlebih",d:"Tiup ringan debu yang menempel agar tidak tebal.",s:"HR. al-Bukhari 338"},
{t:"Mengusap wajah dan kedua telapak tangan",d:"Usap wajah satu kali, lalu usap punggung telapak tangan kanan dengan kiri dan sebaliknya. Sebagian ulama menambah tepukan kedua sampai siku; riwayat Ammar mencukupkan wajah dan telapak tangan.",s:"HR. al-Bukhari 338, Muslim 368"},
{t:"Hal yang membatalkan tayammum",d:"Semua pembatal wudhu, ditambah ditemukannya air (sebelum sholat) atau hilangnya uzur.",s:"Kaidah fikih; lihat bagian Pembatal"}];
const BATAL_WUDHU=[
{t:"Keluar sesuatu dari dua jalan",d:"Kencing, buang air besar, kentut, madzi, dan sejenisnya.",s:"QS. Al-Ma'idah 5:6; HR. al-Bukhari 135"},
{t:"Hilang akal",d:"Tidur nyenyak yang tidak sadar, pingsan, mabuk, atau gila. Kantuk ringan yang masih sadar tidak membatalkan.",s:"HR. Abu Dawud 203"},
{t:"Memakan daging unta",d:"Menurut hadis sahih, wajib berwudhu setelah makan daging unta.",s:"HR. Muslim 360"},
{t:"Menyentuh kemaluan tanpa penghalang",d:"Dengan telapak tangan langsung. Ulama berbeda pendapat; hadis Busrah menjadi dalil yang membatalkan.",s:"HR. Abu Dawud 181, at-Tirmidzi 82"},
{t:"Menyentuh lawan jenis",d:"Para ulama berbeda pendapat. Jika tanpa syahwat, banyak ulama menilainya tidak membatalkan. Ikuti pendapat yang Anda pelajari dari guru tepercaya.",s:"Khilafiyah mu'tabar"}];
const BATAL_SHOLAT=[
{t:"Berbicara dengan sengaja",d:"Berbicara urusan dunia membatalkan sholat. Lupa atau tidak tahu hukumnya dimaafkan.",s:"HR. Muslim 537"},
{t:"Hadas (batal wudhu)",d:"Sholat tidak diterima tanpa suci. Jika batal di tengah sholat, keluar dan berwudhu lagi.",s:"HR. al-Bukhari 135"},
{t:"Makan dan minum",d:"Sengaja makan atau minum di dalam sholat membatalkannya (ijma' ulama).",s:"Ijma' (Ibnul Mundzir)"},
{t:"Tertawa terbahak-bahak",d:"Tertawa bersuara membatalkan sholat; tersenyum tidak.",s:"Ijma' (Ibnul Mundzir)"},
{t:"Gerakan banyak berturut-turut",d:"Gerakan yang tidak diperlukan dan beruntun hingga tampak bukan sedang sholat. Gerakan ringan yang dibutuhkan diperbolehkan.",s:"HR. al-Bukhari 516"},
{t:"Meninggalkan rukun atau syarat dengan sengaja",d:"Misalnya sengaja membelakangi kiblat, terbuka aurat, atau meninggalkan rukun. Jika lupa pada rukun, ikuti rincian sujud sahwi.",s:"HR. al-Bukhari 757"},
{t:"Memutus niat",d:"Berniat keluar dari sholat atau ragu-ragu untuk melanjutkan.",s:"HR. al-Bukhari 1"}];
const TIPS=[
{t:"Mulai dari wudhu terbaik",d:"Berwudhu dengan tenang membuat hati lebih siap sebelum takbir. Pakai waktu dua menit sebelum adzan.",s:"HR. Muslim 223"},
{t:"Pasang reminder 10 menit lebih awal",d:"Selesaikan pekerjaan dan siapkan tempat sholat sebelum adzan, bukan setelahnya.",s:""},
{t:"Sholat tepat waktu adalah amal tercinta",d:"Nabi ﷺ menyebut sholat pada waktunya sebagai amal yang paling dicintai Allah.",s:"HR. al-Bukhari 527, Muslim 85"},
{t:"Lima sholat, penghapus dosa",d:"Seperti sungai di depan pintu yang dipakai mandi lima kali sehari, begitu sholat membersihkan dosa.",s:"HR. Muslim 667"},
{t:"Utamakan berjamaah",d:"Sholat berjamaah lebih utama 27 derajat. Ajak keluarga atau rekan kerja ke masjid.",s:"HR. al-Bukhari 645, Muslim 650"},
{t:"Hadirkan makna bacaan",d:"Pelajari satu arti bacaan per hari. Sholat terasa hidup ketika kita paham yang diucapkan.",s:""},
{t:"Jauhkan gawai saat sholat",d:"Letakkan ponsel dalam mode senyap di luar tempat sholat. Fokus lebih mudah dijaga.",s:""},
{t:"Sholat adalah cahaya",d:"Saat lelah, ingat bahwa sholat menjadi cahaya bagi pelakunya.",s:"HR. Muslim 223"},
{t:"Tuma'ninah, jangan tergesa",d:"Tenangkan satu napas di setiap rukun. Kualitas lebih penting dari kecepatan.",s:"HR. al-Bukhari 757"},
{t:"Tambahkan sunnah rawatib",d:"Mulai dari dua rakaat sebelum Subuh yang lebih baik dari dunia seisinya.",s:"HR. Muslim 725"},
{t:"Berdoa di sujud",d:"Sujud adalah saat terdekat hamba kepada Tuhannya. Perbanyak doa di dalamnya.",s:"HR. Muslim 482"},
{t:"Mulai kecil, jaga konsisten",d:"Amal yang paling dicintai adalah yang terus-menerus walau sedikit. Targetkan lima sholat hari ini saja.",s:"HR. al-Bukhari 6464, Muslim 783"}];
