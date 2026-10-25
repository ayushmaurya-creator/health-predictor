
//  function dark mode aur light mode switch karne ke liye hai
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  let btn = document.getElementById("themeToggle");
  
  if (document.body.classList.contains("dark-mode")) {
    btn.innerText = "☀️ Light Mode";
  } else {
    btn.innerText = "🌙 Dark Mode";
  }
}

// Jab user .json file upload karega toh form automatically fill hoga
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // json se data nikal kar form me daalna
      document.getElementById("pName").value = data.name || "";
      document.getElementById("pAge").value = data.age || "";
      document.getElementById("pGender").value = data.gender || "Male";
      document.getElementById("sugar").value = data.sugar || "";
      document.getElementById("bp").value = data.bp || "";
      document.getElementById("hb").value = data.hb || "";
      document.getElementById("wbc").value = data.wbc || "";
      document.getElementById("platelets").value = data.platelets || "";
      document.getElementById("cholesterol").value = data.cholesterol || "";
      document.getElementById("triglycerides").value = data.triglycerides || "";
      document.getElementById("creatinine").value = data.creatinine || "";
      document.getElementById("urea").value = data.urea || "";
      document.getElementById("sgpt").value = data.sgpt || "";
      document.getElementById("bilirubin").value = data.bilirubin || "";
      
      alert("✅ File Uploaded Successfully! Running Analysis...");
      checkReport(); // Auto run analysis taaki turant result dikhe
    } catch (err) {
      alert("❌ Error: Invalid JSON File. Format check karo.");
    }
  };
  reader.readAsText(file);
}

// Quick demo buttons ke liye functions
function fillNormal() {
  document.getElementById("pName").value = "Rahul Sharma"; document.getElementById("pAge").value = "32";
  document.getElementById("sugar").value = 85; document.getElementById("bp").value = 118; document.getElementById("hb").value = 14;
  document.getElementById("wbc").value = 6500; document.getElementById("platelets").value = 250000;
  document.getElementById("cholesterol").value = 160; document.getElementById("triglycerides").value = 120;
  document.getElementById("creatinine").value = 0.9; document.getElementById("urea").value = 14;
  document.getElementById("sgpt").value = 25; document.getElementById("bilirubin").value = 0.6;
  checkReport();
}

function fillHeartLiverRisk() {
  document.getElementById("pName").value = "Suresh Verma"; document.getElementById("pAge").value = "65";
  document.getElementById("sugar").value = 110; document.getElementById("bp").value = 155; document.getElementById("hb").value = 13;
  document.getElementById("wbc").value = 8000; document.getElementById("platelets").value = 210000;
  document.getElementById("cholesterol").value = 270; document.getElementById("triglycerides").value = 220;
  document.getElementById("creatinine").value = 1.0; document.getElementById("urea").value = 16;
  document.getElementById("sgpt").value = 110; document.getElementById("bilirubin").value = 1.7; 
  checkReport();
}

// Form ko saaf  karne ke liye
function clearForm() {
  var inputs = document.querySelectorAll('input');
  for(var i=0; i<inputs.length; i++) inputs[i].value = ""; 
  
  document.getElementById("patientInfoDisplay").innerText = "Patient Data Pending...";
  document.getElementById("statusBanner").style.backgroundColor = "var(--border-color)";
  document.getElementById("statusBanner").style.color = "var(--text-main)";
  document.getElementById("statusBanner").innerText = "Awaiting test values...";
  document.getElementById("warningBox").style.display = "none";
  document.getElementById("actionPanel").style.display = "none";
  document.getElementById("testList").innerHTML = "<li>No data checked yet.</li>";
  document.getElementById("printBtn").style.display = "none";
}

// --- main analysis Logic 
function checkReport() {
  var pName = document.getElementById("pName").value || "Unknown";
  var pAge = parseInt(document.getElementById("pAge").value) || 0;
  
  // saari medical values ko input se extract karna
  var sugar = parseFloat(document.getElementById("sugar").value);
  var bp = parseFloat(document.getElementById("bp").value);
  var hb = parseFloat(document.getElementById("hb").value);
  var wbc = parseFloat(document.getElementById("wbc").value);
  var platelets = parseFloat(document.getElementById("platelets").value);
  var cholesterol = parseFloat(document.getElementById("cholesterol").value);
  var triglycerides = parseFloat(document.getElementById("triglycerides").value);
  var creatinine = parseFloat(document.getElementById("creatinine").value);
  var urea = parseFloat(document.getElementById("urea").value);
  var sgpt = parseFloat(document.getElementById("sgpt").value);
  var bilirubin = parseFloat(document.getElementById("bilirubin").value);

  // validation: agar koi zaruri value miss ho
  if (isNaN(sugar) || isNaN(bp) || isNaN(creatinine)) {
    alert("Bhai, kam se kam Sugar, BP aur Creatinine toh daal!");
    return;
  }

  // right side header update karo
  document.getElementById("patientInfoDisplay").innerText = "👤 " + pName + " | Age: " + pAge;
  document.getElementById("printBtn").style.display = "block"; // Print button show karo

  var listHTML = "";
  var abnormalCount = 0;

  // helper function list me add karne ke liye
  function addRow(name, val, cond, text) {
    if(cond === "HIGH") { 
      abnormalCount++; 
      return `<li><span>${name}: ${val}</span> <span><span class='text-high'>[HIGH]</span> <i>(${text})</i></span></li>`; 
    }
    if(cond === "LOW") { 
      abnormalCount++; 
      return `<li><span>${name}: ${val}</span> <span><span class='text-low'>[LOW]</span> <i>(${text})</i></span></li>`; 
    }
    return `<li><span>${name}: ${val}</span> <span class='text-normal'>[NORMAL]</span></li>`;
  }

  // individual tests check ho rahe hain
  listHTML += addRow("Sugar", sugar, sugar > 100 ? "HIGH" : sugar < 70 ? "LOW" : "NORMAL", "Diabetes");
  listHTML += addRow("BP", bp, bp > 120 ? "HIGH" : bp < 90 ? "LOW" : "NORMAL", "Hypertension");
  listHTML += addRow("Hb", hb, hb > 16 ? "HIGH" : hb < 12 ? "LOW" : "NORMAL", "Anemia");
  listHTML += addRow("WBC", wbc, wbc > 11000 ? "HIGH" : wbc < 4500 ? "LOW" : "NORMAL", "Infection");
  listHTML += addRow("Platelets", platelets, platelets > 450000 ? "HIGH" : platelets < 150000 ? "LOW" : "NORMAL", "Bleeding");
  listHTML += addRow("Cholesterol", cholesterol, cholesterol > 200 ? "HIGH" : "NORMAL", "Blockage");
  listHTML += addRow("Triglycerides", triglycerides, triglycerides > 150 ? "HIGH" : "NORMAL", "Fatty Heart");
  listHTML += addRow("Creatinine", creatinine, creatinine > 1.2 ? "HIGH" : creatinine < 0.6 ? "LOW" : "NORMAL", "Kidney");
  listHTML += addRow("Urea", urea, urea > 20 ? "HIGH" : "NORMAL", "Kidney Stress");
  listHTML += addRow("SGPT", sgpt, sgpt > 56 ? "HIGH" : "NORMAL", "Liver");
  listHTML += addRow("Bilirubin", bilirubin, bilirubin > 1.2 ? "HIGH" : "NORMAL", "Jaundice");

  document.getElementById("testList").innerHTML = listHTML;

  // combinations check karna
  var warningMessage = "";
  
  if (bp > 140 && cholesterol > 200 && triglycerides > 150) {
    warningMessage += "<b>⚠️ Heart Stroke Alert:</b> High BP aur High Cholesterol sath me mila hai.<br>";
  }
  if (sugar > 140 && creatinine > 1.2 && urea > 20) {
    warningMessage += "<b>⚠️ Kidney Alert:</b> Diabetic Nephropathy ke signs dikh rahe hain.<br>";
  }
  if (wbc > 12000 && platelets < 100000) {
    warningMessage += "<b>⚠️ Infection Alert:</b> Sepsis risk hai (High WBC + Low Platelets).<br>";
  }

  // warning box
  var banner = document.getElementById("statusBanner");
  var warningBox = document.getElementById("warningBox");
  var actionPanel = document.getElementById("actionPanel");

  if (warningMessage !== "") {
    banner.style.backgroundColor = "#e74c3c"; 
    banner.style.color = "white";
    banner.innerText = "CRITICAL: Dangerous Combinations Detected!";
    warningBox.style.display = "block";
    warningBox.innerHTML = warningMessage;
    actionPanel.style.display = "flex"; // Emergency Action Buttons dikhao
  } else if (abnormalCount > 0) {
    banner.style.backgroundColor = "#f39c12"; 
    banner.style.color = "white";
    banner.innerText = "WARNING: " + abnormalCount + " indicators range se baahar hain.";
    warningBox.style.display = "none";
    actionPanel.style.display = "none";
  } else {
    banner.style.backgroundColor = "#2ecc71"; 
    banner.style.color = "white";
    banner.innerText = "SAFE: Patient ki saari reports Normal hain.";
    warningBox.style.display = "none";
    actionPanel.style.display = "none";
  }
}