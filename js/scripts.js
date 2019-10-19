var testaJautajumi;
var preloader;
var jautajums = 0;
var rezultats = 0;
var pareiza = []; // pareizo atbilžu masīvs

// atverot testu nerāda atbilžu pogas
window.onload = atverotTestu;
function atverotTestu() {
  slept("atbil");
}

function pienemAtbildi() {
  rezultataUzskaite(jautajums);
}

function rezultataUzskaite() {
  console.log(document.activeElement.value + " - " + pareiza[jautajums]);
  if (document.activeElement.value == pareiza[jautajums]) {
    rezultats++;
  }
}

function beidzSpeli() {
  slept("atbil");
  radit("rezult");
  document.getElementById("jaut").innerText = "Tests beidzies!";
  jautajums += 1;
  console.log(
    "Testā ieguvi " + rezultats + " punktus no " + jautajums + " jautājumiem!"
  );
  let p = "";
  for (let i = 0; i < jautajums; i++) {
    p =
      p +
      (i + 1) +
      ". " +
      testaJautajumi[i].jautajums +
      " - " +
      pareiza[i] +
      ";<br>";
  }
  document.getElementById("rezult").innerHTML =
    "Testā iegūtie punkti - " +
    rezultats +
    " no " +
    jautajums +
    " jautājumiem. <br>Pareizās atbildes:<br>" +
    p;
}

function atteloHTML() {
  raditDIV("atbil");
  radit("jaut");
  testaJautajumiNoCSV(function(results) {
    testaJautajumi = results.data.map(function(csvJautajums) {
      return {
        jautajums: csvJautajums.jautajums,
        atbildes: [
          csvJautajums.atbilde1,
          csvJautajums.atbilde2,
          csvJautajums.atbilde3,
          csvJautajums.atbilde4
        ]
      };
    });
    testaJautajumi = shuffle(testaJautajumi);
    console.log(testaJautajumi);
    nomainitJautajumu(jautajums);
  });
  // kad sākas tests poga par testa sākšanu un rezultāts tiek paslēpta
  slept("sakums");
  slept("rezult");
}

function nomainitJautajumu() {
  // Nomaina jautājumu
  pareiza[jautajums] = testaJautajumi[jautajums].atbildes[0];
  console.log("Pareizā atbilde: " + pareiza[jautajums] + ", j=" + jautajums);
  testaJautajumi[jautajums].atbildes = shuffle(
    testaJautajumi[jautajums].atbildes
  );
  document.getElementById("jaut").innerText =
    jautajums + 1 + ". " + testaJautajumi[jautajums].jautajums;
  // Nomaina atbilžu pogas
  let atbilzuTeksti = document.getElementsByClassName("atb");
  for (let i = 0; i < testaJautajumi[jautajums].atbildes.length; i++) {
    atbilzuTeksti[i].value = testaJautajumi[jautajums].atbildes[i];
  }
}

function nakamais() {
  // Pēc atbildes nospiešanas uztaisa pauzi, parāda infomatīvu logu, ka atbilde pieņemta
  preloader = document.querySelector(".preloader");
  pienemAtbildi();
  fadeEffect();
  // nomainaam tekstu kad ir vistumshaakais :)
  setTimeout(function() {
    if (jautajums < testaJautajumi.length - 1) {
      // liekam jaunu (naakamo) bildi iekshaa
      jautajums += 1;
      nomainitJautajumu(jautajums);
    } else {
      // jautajumi beigushies!
      beidzSpeli();
    }
  }, 1000);
}

function testaJautajumiNoCSV(callback) {
  const url = "https://in24.github.io/zinasanuParbaudesTests/dati/tests.csv";
  Papa.parse(url, {
    download: true,
    header: true,
    dynamicTyping: true,
    delimiter: ";",
    complete: function(results) {
      callback(results);
    }
  });
  console.log("CSV fails nolasīts");
}

function fadeEffect() {
  preloader.classList.replace("behind", "front");
  // saakas transition no opacity 0->1, 1 sekundi ilga
  preloader.style.opacity = 1;
  // taapeec uzliekam timeout uz 1000ms, kad saakam transition 1->0
  setTimeout(function() {
    preloader.style.opacity = 0;
  }, 1000);
  // otraa transition beidzas peec 2s, aizvaacam, lai netraucee spiest pogas
  setTimeout(function() {
    preloader.classList.replace("front", "behind");
  }, 2000);
}

function shuffle(mas) {
  // Fisher–Yates sajaukšanas algoritms masīvam
  //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  var k, x, i;
  for (i = mas.length - 1; i > 0; i--) {
    k = Math.floor(Math.random() * (i + 1));
    x = mas[i];
    mas[i] = mas[k];
    mas[k] = x;
  }
  return mas;
}

function raditDIV(s) {
  document.getElementById(s).style.display = "flex";
}

function radit(s) {
  //document.getElementById(s).hidden = 0;
  document.getElementById(s).style.display = "block";
}

function slept(s) {
  document.getElementById(s).style.display = "none";
}