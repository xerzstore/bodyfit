
// ======================================
// BODYFIT - JAVASCRIPT
// BMI DEWASA + BMI-FOR-AGE WHO
// ======================================


// 1. ELEMEN HTML

const themeToggle = document.getElementById("themeToggle");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const height = document.getElementById("height");
const weight = document.getElementById("weight");

const heightValue = document.getElementById("heightValue");
const weightValue = document.getElementById("weightValue");

const calculateBtn = document.getElementById("calculateBtn");
const result = document.getElementById("result");


// 2. DARK MODE / LIGHT MODE

const savedTheme = localStorage.getItem("bodyfit-theme");

if (savedTheme === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌙";
} else {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");

  themeToggle.textContent = isLight ? "🌙" : "☀️";

  localStorage.setItem(
    "bodyfit-theme",
    isLight ? "light" : "dark"
  );
});


// 3. SLIDER

function updateSlider() {
  heightValue.textContent = height.value + " cm";
  weightValue.textContent = weight.value + " kg";
}

height.addEventListener("input", updateSlider);
weight.addEventListener("input", updateSlider);

updateSlider();


// 4. DATA REFERENSI BMI-FOR-AGE WHO 2007
// Format: [-3 SD, -2 SD, +1 SD, +2 SD]
// Berdasarkan titik usia tahunan pada tabel ringkas WHO.

const whoReference = {

  male: {
    5:  [12.1, 13.0, 16.6, 18.3],
    6:  [12.1, 13.0, 16.8, 18.5],
    7:  [12.3, 13.1, 17.0, 19.0],
    8:  [12.4, 13.3, 17.4, 19.7],
    9:  [12.6, 13.5, 17.9, 20.5],
    10: [12.8, 13.7, 18.5, 21.4],
    11: [13.1, 14.1, 19.2, 22.5],
    12: [13.4, 14.5, 19.9, 23.6],
    13: [13.8, 14.9, 20.8, 24.8],
    14: [14.3, 15.5, 21.8, 25.9],
    15: [14.7, 16.0, 22.7, 27.0],
    16: [15.1, 16.5, 23.5, 27.9],
    17: [15.4, 16.9, 24.3, 28.6],
    18: [15.7, 17.3, 24.9, 29.2],
    19: [15.9, 17.6, 25.4, 29.7]
  },

  female: {
    5:  [11.8, 12.7, 16.9, 18.9],
    6:  [11.7, 12.7, 17.0, 19.2],
    7:  [11.8, 12.7, 17.3, 19.8],
    8:  [11.9, 12.9, 17.7, 20.6],
    9:  [12.1, 13.1, 18.3, 21.5],
    10: [12.4, 13.5, 19.0, 22.6],
    11: [12.7, 13.9, 19.9, 23.7],
    12: [13.2, 14.4, 20.8, 25.0],
    13: [13.6, 14.9, 21.8, 26.2],
    14: [14.0, 15.4, 22.7, 27.3],
    15: [14.4, 15.9, 23.5, 28.2],
    16: [14.6, 16.2, 24.1, 28.9],
    17: [14.7, 16.4, 24.5, 29.3],
    18: [14.7, 16.4, 24.8, 29.5],
    19: [14.7, 16.5, 25.0, 29.7]
  }

};


// 5. KALKULATOR BMI

calculateBtn.addEventListener("click", () => {

  const userAge = Number(age.value);
  const userHeight = Number(height.value);
  const userWeight = Number(weight.value);
  const userGender = gender.value;

  // Validasi

  if (
    !Number.isInteger(userAge) ||
    userAge < 2 ||
    userAge > 120
  ) {
    result.innerHTML = `
      <h3>Periksa Kembali Data</h3>
      <p>Masukkan usia antara 2 sampai 120 tahun.</p>
    `;
    return;
  }

  const heightMeter = userHeight / 100;
  const bmi = userWeight / (heightMeter * heightMeter);
  const bmiResult = bmi.toFixed(1);


  // USIA 2-4 TAHUN

  if (userAge < 5) {
    result.innerHTML = `
      <h3>Hasil Pengukuran</h3>

      <div class="bmi-number">${bmiResult}</div>

      <span class="status-badge status-info">
        BMI berhasil dihitung
      </span>

      <p>
        Untuk usia di bawah 5 tahun,
        diperlukan standar pertumbuhan khusus
        WHO untuk anak usia dini.
      </p>

      <p>
        BODYFIT belum memberikan kategori
        otomatis untuk kelompok usia ini.
      </p>
    `;
    return;
  }


  // USIA 5-19 TAHUN: WHO BMI-FOR-AGE

  if (userAge < 20) {

    const thresholds = whoReference[userGender][userAge];

    const minus3 = thresholds[0];
    const minus2 = thresholds[1];
    const plus1 = thresholds[2];
    const plus2 = thresholds[3];

    let category = "";
    let statusClass = "";
    let explanation = "";

    if (bmi < minus3) {

      category = "Sangat kurus";
      statusClass = "status-danger";
      explanation =
        "Hasil berada di bawah batas -3 SD menurut acuan BMI berdasarkan usia.";

    } else if (bmi < minus2) {

      category = "Kurus";
      statusClass = "status-warning";
      explanation =
        "Hasil berada di bawah batas -2 SD menurut acuan BMI berdasarkan usia.";

    } else if (bmi <= plus1) {

      category = "Rentang sesuai usia";
      statusClass = "status-normal";
      explanation =
        "Hasil berada dalam rentang -2 SD hingga +1 SD.";

    } else if (bmi <= plus2) {

      category = "Berat badan berlebih";
      statusClass = "status-warning";
      explanation =
        "Hasil berada di atas batas +1 SD.";

    } else {

      category = "Obesitas";
      statusClass = "status-danger";
      explanation =
        "Hasil berada di atas batas +2 SD.";

    }

    result.innerHTML = `
      <h3>Hasil Pengukuran</h3>

      <div class="bmi-number">${bmiResult}</div>

      <span class="status-badge ${statusClass}">
        ${category}
      </span>

      <p>${explanation}</p>

      <p>
        Usia: ${userAge} tahun<br>
        Jenis kelamin:
        ${userGender === "male" ? "Laki-laki" : "Perempuan"}<br>
        Tinggi: ${userHeight} cm<br>
        Berat: ${userWeight} kg
      </p>

      <p>
        Penilaian menggunakan acuan WHO BMI-for-age
        2007 untuk usia 5-19 tahun.
        Hasil ini merupakan informasi awal,
        bukan diagnosis medis.
      </p>
    `;

    return;
  }


  // USIA 20 TAHUN KE ATAS: BMI DEWASA

  let category = "";
  let statusClass = "";
  let explanation = "";

  if (bmi < 18.5) {

    category = "Berat badan kurang";
    statusClass = "status-warning";
    explanation = "BMI berada di bawah rentang normal dewasa.";

  } else if (bmi < 25) {

    category = "Rentang BMI normal";
    statusClass = "status-normal";
    explanation = "BMI berada dalam rentang normal dewasa.";

  } else if (bmi < 30) {

    category = "Berat badan berlebih";
    statusClass = "status-warning";
    explanation = "BMI berada di atas rentang normal dewasa.";

  } else {

    category = "Obesitas";
    statusClass = "status-danger";
    explanation = "BMI berada dalam kategori obesitas dewasa.";

  }

  result.innerHTML = `
    <h3>Hasil Pengukuran</h3>

    <div class="bmi-number">${bmiResult}</div>

    <span class="status-badge ${statusClass}">
      ${category}
    </span>

    <p>${explanation}</p>

    <p>
      Usia: ${userAge} tahun<br>
      Tinggi: ${userHeight} cm<br>
      Berat: ${userWeight} kg
    </p>

    <p>
      BMI merupakan indikator skrining,
      bukan diagnosis kesehatan secara keseluruhan.
    </p>
  `;

});
