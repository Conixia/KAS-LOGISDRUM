// =========================
// KONFIGURASI
// =========================

const API_URL = "https://script.google.com/macros/s/AKfycbxUuApNsbLOHAR6VMKpCkw7FXmN2uXkAO7Uso1FoPw4BJUQ7Q892p5fsJDRHrqAnpO5mQ/exec";

// Maksimal sisi gambar setelah dikompres
const MAX_WIDTH = 1280;

// Kualitas JPG (0 - 1)
const QUALITY = 0.8;


// =========================
// ELEMENT
// =========================

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const success = document.getElementById("success");

const nama = document.getElementById("nama");
const namaTerpilih = document.getElementById("namaTerpilih");

const rekening = document.getElementById("rekening");

const nextBtn = document.getElementById("nextBtn");
const copyBtn = document.getElementById("copyBtn");
const submitBtn = document.getElementById("submitBtn");

const bukti = document.getElementById("bukti");
const check = document.getElementById("check");


// =========================
// PREVIEW
// =========================

const preview = document.createElement("img");

preview.id = "preview";

preview.style.display = "none";

bukti.parentNode.appendChild(preview);


const info = document.createElement("div");

info.style.marginTop = "10px";
info.style.textAlign = "center";
info.style.color = "#666";

bukti.parentNode.appendChild(info);


// hasil kompres

let compressedBase64 = "";

let compressedSize = 0;


// =========================
// NEXT
// =========================

nextBtn.onclick = () => {

    if (nama.value == "") {

        alert("Silakan pilih nama.");

        return;

    }

    namaTerpilih.innerText = nama.value;

    page1.classList.add("hidden");

    page2.classList.remove("hidden");

};


// =========================
// COPY REKENING
// =========================

copyBtn.onclick = async () => {

    await navigator.clipboard.writeText(

        rekening.innerText

    );

    copyBtn.innerText = "✅ Nomor Rekening Disalin";

    setTimeout(() => {

        copyBtn.innerText = "📋 Salin Nomor Rekening";

    },2000);

};


// =========================
// PILIH GAMBAR
// =========================

bukti.onchange = async () => {

    const file = bukti.files[0];

    if(!file) return;

    if(file.size > 8 * 1024 * 1024){

        alert("Ukuran gambar maksimal 8 MB.");

        bukti.value="";

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        const img = new Image();

        img.onload = function(){

            let width = img.width;
            let height = img.height;

            if(width > MAX_WIDTH){

                height = height * MAX_WIDTH / width;
                width = MAX_WIDTH;

            }

            const canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img,0,0,width,height);

            compressedBase64 = canvas
            .toDataURL("image/jpeg",QUALITY)
            .split(",")[1];

            preview.src = canvas.toDataURL("image/jpeg",QUALITY);

            preview.style.display="block";

            compressedSize = Math.round(

                (compressedBase64.length * 0.75)/1024

            );

            info.innerHTML = `

            <br>

            <b>${file.name}</b>

            <br>

            Ukuran Asli :
            ${(file.size/1024/1024).toFixed(2)} MB

            <br>

            Setelah Kompres :
            ${compressedSize} KB ✅

            `;

        }

        img.src = e.target.result;

    }

    reader.readAsDataURL(file);

};


// =========================
// SUBMIT
// =========================

submitBtn.onclick = async ()=>{

    if(!check.checked){

        alert("Centang konfirmasi transfer.");

        return;

    }

    if(compressedBase64==""){

        alert("Upload bukti transfer.");

        return;

    }

    submitBtn.disabled=true;

    submitBtn.innerText="Mengupload...";

    try{

const response = await fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({
        nama:nama.value,
        image:compressedBase64,
        filename:bukti.files[0].name,
        size:compressedSize
    })
});

        const result = await response.json();

        if(result.success){

            page2.classList.add("hidden");

            success.classList.remove("hidden");

        }else{

            throw new Error();

        }

    }

    catch(e){

        alert("Upload gagal.");

        submitBtn.disabled=false;

        submitBtn.innerText="Kirim";

    }

};
