// code here, goodluck!!
'use strict';

const readline = require('readline');

// Setup Interface CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper: Mengubah rl.question menjadi Promise agar bisa pakai async/await
const ask = (query) => new Promise(resolve => rl.question(query, resolve));

/**
 * 1. VALIDASI INPUT
 * Memastikan input adalah angka yang valid. 
 * Menggunakan Number() dan menangani edge case (string kosong, spasi, dll).
 * "Memaksa" user mengulang input sampai benar via while(true).
 */
const promptValidNumber = async (message) => {
  while (true) {
    const input = await ask(message);
    const trimmed = input.trim();
    
    // Mekanisme exit
    if (['exit', 'q', 'quit'].includes(trimmed.toLowerCase())) {
      return null; 
    }

    // Konversi & Validasi
    const num = Number(trimmed);
    // Number('') menghasilkan 0, jadi kita cek trimmed !== '' secara eksplisit
    if (trimmed !== '' && !Number.isNaN(num)) {
      return num;
    }

    console.log('⚠️  Input tidak valid. Harap masukkan angka yang benar.');
  }
};

/**
 * Validasi operator matematika
 */
const promptValidOperator = async (message) => {
  const validOps = ['+', '-', '*', '/'];
  while (true) {
    const input = await ask(message);
    const trimmed = input.trim();
    
    if (['exit', 'q', 'quit'].includes(trimmed.toLowerCase())) return null;
    
    if (validOps.includes(trimmed)) {
      return trimmed;
    }

    console.log('⚠️  Operator tidak valid. Gunakan salah satu: +, -, *, /');
  }
};

/**
 * 2. OPERASI MATEMATIKA DASAR
 * Disusun dalam object mapping agar mudah dikelola & diekstensikan.
 */
const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => {
    if (b === 0) throw new Error('Pembagian dengan nol tidak diperbolehkan.');
    return a / b;
  }
};

/**
 * 4. ANALISIS HASIL PERHITUNGAN
 * Menganalisis berdasarkan tipe data, status nilai, dan sifat bilangan.
 */
const analyzeResult = (result) => {
  console.log('\n📊 Analisis Hasil Perhitungan:');
  console.log(`   • Tipe Data      : ${typeof result}`);
  
  if (Number.isNaN(result)) {
    console.log('   • Status Nilai     : NaN (Not a Number)');
  } else if (!Number.isFinite(result)) {
    console.log('   • Status Nilai     : Infinity (Nilai tak terhingga)');
  } else if (result === 0) {
    console.log('   • Status Nilai     : Nol (Neutral)');
  } else if (result > 0) {
    console.log('   • Status Nilai     : Positif');
  } else {
    console.log('   • Status Nilai     : Negatif');
  }

  console.log(`   • Bilangan Bulat?  : ${Number.isInteger(result) ? 'Ya' : 'Tidak (Desimal/Float)'}`);
  console.log('-------------------------------------------');
};

/**
 * 3 & 5. LOGIKA UTAMA & MEKANISME EXIT
 * Menggunakan loop berkelanjutan dan conditional branching.
 */
const runCalculator = async () => {
  console.log('🧮 KALKULATOR CLI INTERAKTIF');
  console.log('Ketik "exit", "q", atau "quit" untuk keluar kapan saja.\n');

  try {
    while (true) {
      // Ambil input dengan validasi otomatis
      const num1 = await promptValidNumber('Masukkan angka pertama: ');
      if (num1 === null) break; // Exit signal

      const op = await promptValidOperator('Pilih operator (+, -, *, /): ');
      if (op === null) break;

      const num2 = await promptValidNumber('Masukkan angka kedua: ');
      if (num2 === null) break;

      // Eksekusi perhitungan
      try {
        const result = operations[op](num1, num2);
        console.log(`\n✅ ${num1} ${op} ${num2} = ${result}`);
        analyzeResult(result);
      } catch (error) {
        console.log(`\n❌ Error: ${error.message}`);
        // continue agar loop kembali ke awal tanpa crash
        continue;
      }

      // Tanya user apakah ingin lanjut
      const cont = await ask('\n🔄 Hitung lagi? (y/n): ');
      const cleanCont = cont.trim().toLowerCase();
      if (['n', 'no', 'exit', 'q'].includes(cleanCont)) break;
    }
  } finally {
    // 5. MEKANISME EXIT YANG BERSIH
    console.log('\n👋 Terima kasih telah menggunakan Kalkulator CLI.');
    rl.close();
  }
};

// Handle Ctrl+C (SIGINT) agar tidak error saat force quit
rl.on('SIGINT', () => {
  console.log('\n👋 Dihentikan oleh pengguna (Ctrl+C).');
  rl.close();
});

// Jalankan aplikasi
runCalculator();