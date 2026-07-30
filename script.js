// ===============================
// GANTI DENGAN URL APPS SCRIPT
// ===============================

const API_URL = "YOUR_APPS_SCRIPT_URL";


// ===============================
// ELEMENT
// ===============================

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const success = document.getElementById("success");

const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const copyBtn = document.getElementById("copyBtn");

const nama = document.getElementById("nama");
const namaTerpilih = document.getElementById("namaTerpilih");

const rekening = document.getElementById("rekening");

const bukti = document.getElementById("bukti");

const check = document.getElementById("check");


// Preview gambar
let preview = document.createElement("img");
preview.style.width = "100%";
preview.style.marginTop = "15px";
preview.style.borderRadius = "12px";
preview.style.display = "none";

bukti.parentNode.appendChild(preview);


// ===============================
// NEXT
// ===============================

nextBtn.addEventListener("click", () => {

    if (nama.value == "") {

        alert("Silakan pilih nama terlebih dahulu.");

        return;

    }

    namaTerpilih.innerText = nama.value;

    page1.classList.add("hidden");

    page2.classList.remove("hidden");

});


// ===============================
// COPY REKENING
// ===============================

copyBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(rekening.innerText);

    copyBtn.innerText = "✅ Nomor Rekening Disalin";

    setTimeout(() => {

        copyBtn.innerText = "📋 Salin Nomor Rekening";

    },2000);

});


// ===============================
// PREVIEW GAMBAR
// ===============================

bukti.addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

});


// ===============================
// SUBMIT
// ===============================

submitBtn.addEventListener("click", async ()=>{

    if(!check.checked){

        alert("Centang konfirmasi transfer terlebih dahulu.");

        return;

    }

    if(bukti.files.length==0){

        alert("Upload bukti transfer.");

        return;

    }

    submitBtn.disabled=true;

    submitBtn.innerText="Mengirim...";



    const file = bukti.files[0];

    const reader = new FileReader();

    reader.onload = async function(){

        const base64 = reader.result.split(",")[1];

        const payload = {

            nama:nama.value,

            image:base64,

            filename:file.name

        };


        try{

            const res = await fetch(API_URL,{

                method:"POST",

                body:JSON.stringify(payload)

            });

            const hasil = await res.json();

            page2.classList.add("hidden");

            success.classList.remove("hidden");

        }

        catch(e){

            alert("Gagal mengirim data.");

            console.log(e);

            submitBtn.disabled=false;

            submitBtn.innerText="Kirim";

        }

    }

    reader.readAsDataURL(file);

});
