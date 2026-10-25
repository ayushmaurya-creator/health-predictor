// dark mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  let btn = document.getElementById("themeToggle");
  btn.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// voice alert triage system
function speakAlert(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); 
    let msg = new SpeechSynthesisUtterance(text);
    msg.volume = 1; msg.rate = 1; msg.pitch = 1; msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  }
}

// json file upload logic
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      document.getElementById("pName").value = data.name || ""; document.getElementById("pAge").value = data.age || "";
      document.getElementById("pGender").value = data.gender || "Male"; document.getElementById("height").value = data.height || "";
      document.getElementById("weight").value = data.weight || ""; document.getElementById("sugar").value = data.sugar || "";
      document.getElementById("bp").value = data.bp || ""; document.getElementById("hb").value = data.hb || "";
      document.getElementById("wbc").value = data.wbc || ""; document.getElementById("platelets").value = data.platelets || "";
      document.getElementById("cholesterol").value = data.cholesterol || ""; document.getElementById("creatinine").value = data.creatinine || "";
      document.getElementById("sgpt").value = data.sgpt || ""; document.getElementById("vitd").value = data.vitd || "";
      document.getElementById("vitb12").value = data.vitb12 || ""; document.getElementById("iron").value = data.iron || "";
      document.getElementById("calcium").value = data.calcium || "";
      checkReport(); 
    } catch (err) { alert("❌ Invalid JSON File."); }
  };
  reader.readAsText(file);
}

// demo data for safe patient
function fillNormal() {
  document.getElementById("pName").value = "Rahul Sharma"; document.getElementById("pAge").value = "32";
  document.getElementById("height").value = "175"; document.getElementById("weight").value = "70";
  document.getElementById("sugar").value = 90; document.getElementById("bp").value = 115; document.getElementById("hb").value = 14;
  document.getElementById("wbc").value = 6500; document.getElementById("platelets").value = 250000;
  document.getElementById("cholesterol").value = 160; document.getElementById("creatinine").value = 0.9;
  document.getElementById("sgpt").value = 25; document.getElementById("vitd").value = 35;
  document.getElementById("vitb12").value = 400; document.getElementById("iron").value = 100; document.getElementById("calcium").value = 9.5;
  checkReport();
}

// demo data for high risk patient
function fillRisk() {
  document.getElementById("pName").value = "Suresh Verma"; document.getElementById("pAge").value = "55";
  document.getElementById("height").value = "165"; document.getElementById("weight").value = "88"; 
  document.getElementById("sugar").value = 150; document.getElementById("bp").value = 155; document.getElementById("hb").value = 10;
  document.getElementById("wbc").value = 8000; document.getElementById("platelets").value = 210000;
  document.getElementById("cholesterol").value = 260; document.getElementById("creatinine").value = 1.0;
  document.getElementById("sgpt").value = 40; document.getElementById("vitd").value = 12; 
  document.getElementById("vitb12").value = 150; document.getElementById("iron").value = 45; document.getElementById("calcium").value = 8.0; 
  checkReport();
}

// clear the form and reset ui
function clearForm() {
  document.querySelectorAll('input').forEach(i => i.value = ""); 
  document.getElementById("patientInfoDisplay").innerText = "Patient Data Pending...";
  document.getElementById("scoreBarFill").style.width = "0%";
  document.getElementById("scoreText").innerText = "--";
  document.getElementById("statusBanner").style.backgroundColor = "var(--border-color)";
  document.getElementById("statusBanner").innerText = "Awaiting test values...";
  document.getElementById("warningBox").style.display = "none";
  document.getElementById("actionPanel").style.display = "none";
  document.getElementById("testList").innerHTML = "<li>No data checked yet.</li>";
  document.getElementById("printBtn").style.display = "none";
}

// main medical logic engine
function checkReport() {
  var pName = document.getElementById("pName").value || "Unknown";
  var pAge = parseInt(document.getElementById("pAge").value) || 0;
  
  var height = parseFloat(document.getElementById("height").value) || 1;
  var weight = parseFloat(document.getElementById("weight").value) || 0;
  var bmi = weight > 0 ? (weight / Math.pow(height/100, 2)).toFixed(1) : 0;

  var sugar = parseFloat(document.getElementById("sugar").value);
  var bp = parseFloat(document.getElementById("bp").value);
  var hb = parseFloat(document.getElementById("hb").value);
  var cholesterol = parseFloat(document.getElementById("cholesterol").value);
  var vitd = parseFloat(document.getElementById("vitd").value);
  var vitb12 = parseFloat(document.getElementById("vitb12").value);
  var iron = parseFloat(document.getElementById("iron").value);
  var calcium = parseFloat(document.getElementById("calcium").value);

  // prevent empty submission
  if (isNaN(bp) || isNaN(sugar)) { alert("Please enter at least basic vitals (BP, Sugar) or use Auto-Fill."); return; }

  document.getElementById("patientInfoDisplay").innerText = `👤 ${pName} | Age: ${pAge} Yrs | BMI: ${bmi}`;
  document.getElementById("printBtn").style.display = "block";

  var listHTML = ""; var healthScore = 100; var issues = 0;

  // helper function to render rows
  function addRow(name, val, cond, text) {
    if(cond === "HIGH") { healthScore -= 5; issues++; return `<li><span>${name}: ${val}</span> <span><span class='text-high'>[HIGH]</span> <i>(${text})</i></span></li>`; }
    if(cond === "LOW") { healthScore -= 5; issues++; return `<li><span>${name}: ${val}</span> <span><span class='text-low'>[LOW]</span> <i>(${text})</i></span></li>`; }
    return `<li><span>${name}: ${val}</span> <span class='text-normal'>[NORMAL]</span></li>`;
  }

  // checking individual indicators
  if (bmi > 0) listHTML += addRow("BMI", bmi, bmi > 25 ? "HIGH" : "NORMAL", bmi > 30 ? "Obese" : "Overweight");
  listHTML += addRow("Sugar", sugar, sugar > 100 ? "HIGH" : "NORMAL", "Diabetes Risk");
  listHTML += addRow("BP", bp, bp > 120 ? "HIGH" : "NORMAL", "Hypertension");
  listHTML += addRow("Hb", hb, hb < 12 ? "LOW" : "NORMAL", "Anemia");
  listHTML += addRow("Cholesterol", cholesterol, cholesterol > 200 ? "HIGH" : "NORMAL", "Artery Blockage");
  listHTML += addRow("Vitamin D", vitd, vitd < 20 ? "LOW" : "NORMAL", "Bone/Immunity");
  listHTML += addRow("Vitamin B12", vitb12, vitb12 < 200 ? "LOW" : "NORMAL", "Nerve Damage");
  listHTML += addRow("Iron", iron, iron < 60 ? "LOW" : "NORMAL", "Low Iron");
  listHTML += addRow("Calcium", calcium, calcium < 8.5 ? "LOW" : "NORMAL", "Hypocalcemia");

  document.getElementById("testList").innerHTML = listHTML;

  var warningMessage = ""; var isCritical = false;
  
  // checking dangerous combinations
  if (bmi >= 30 && bp > 140 && cholesterol > 200) { warningMessage += "<b>⚠️ Metabolic Syndrome:</b> Obesity + High BP + Cholesterol severely increases Heart Attack risk.<br>"; healthScore -= 20; isCritical = true; }
  if (hb < 11 && iron < 60 && vitb12 < 200) { warningMessage += "<b>⚠️ Severe Nutritional Anemia:</b> Low Hb paired with Iron & B12 deficiency. Needs IV supplements.<br>"; healthScore -= 15; isCritical = true; }
  if (vitd < 20 && calcium < 8.5) { warningMessage += "<b>⚠️ Bone Demineralization:</b> Low Vit D preventing Calcium absorption.<br>"; healthScore -= 10; }

  if(healthScore < 0) healthScore = 0;

  // score bar ui updates
  let scoreBar = document.getElementById("scoreBarFill");
  document.getElementById("scoreText").innerText = healthScore;
  scoreBar.style.width = healthScore + "%";
  if(healthScore >= 80) scoreBar.style.backgroundColor = "#2ecc71";
  else if(healthScore >= 50) scoreBar.style.backgroundColor = "#f39c12";
  else scoreBar.style.backgroundColor = "#e74c3c";

  // banner status and voice alerts
  var banner = document.getElementById("statusBanner");
  var warningBox = document.getElementById("warningBox");
  var actionPanel = document.getElementById("actionPanel");
  var finalStatus = "Safe";

  if (isCritical) {
    banner.style.backgroundColor = "#e74c3c"; banner.style.color = "white";
    banner.innerText = "CRITICAL: Dangerous Combinations Detected!";
    warningBox.style.display = "block"; warningBox.innerHTML = warningMessage;
    actionPanel.style.display = "flex"; finalStatus = "Critical";
    speakAlert("Emergency Alert! Critical health combinations detected. Please review the patient report immediately.");
  } else if (issues > 0) {
    banner.style.backgroundColor = "#f39c12"; banner.style.color = "white";
    banner.innerText = `WARNING: ${issues} indicator(s) out of range.`;
    warningBox.style.display = warningMessage ? "block" : "none"; warningBox.innerHTML = warningMessage;
    actionPanel.style.display = "none"; finalStatus = "Warning";
    speakAlert("Warning! Some test results are out of normal range.");
  } else {
    banner.style.backgroundColor = "#2ecc71"; banner.style.color = "white";
    banner.innerText = "SAFE: All Patient Health Reports are Normal.";
    warningBox.style.display = "none"; actionPanel.style.display = "none";
    speakAlert("Patient reports are completely normal and safe.");
  }

  saveHistory(pName, finalStatus, healthScore);
}

// local storage history handling
function saveHistory(name, status, score) {
  let history = JSON.parse(localStorage.getItem('mediPulseHistory')) || [];
  let color = status === "Critical" ? "red" : status === "Warning" ? "orange" : "green";
  history.unshift({ name, status, score, color, time: new Date().toLocaleTimeString() });
  if(history.length > 5) history.pop();
  localStorage.setItem('mediPulseHistory', JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem('mediPulseHistory')) || [];
  let list = document.getElementById("historyList");
  list.innerHTML = "";
  if(history.length === 0) { list.innerHTML = "<li>No recent patients.</li>"; return; }
  history.forEach(p => { list.innerHTML += `<li><b>${p.name}</b> <span>Score: ${p.score} | <b style="color:${p.color}">${p.status}</b></span></li>`; });
}
