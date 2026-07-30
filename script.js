// ======================================
// KONFIGURASI
// ======================================

const API_URL = "https://script.google.com/macros/s/AKfycbxUuApNsbLOHAR6VMKpCkw7FXmN2uXkAO7Uso1FoPw4BJUQ7Q892p5fsJDRHrqAnpO5mQ/exec";

// ======================================
// ELEMENT
// ======================================

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

// ======================================
// PREVIEW GAMBAR
// ======================================

const preview = document.createElement("img");
preview.id = "preview";
preview.style.width = "100%";
preview.style.marginTop = "15px";
preview.style.borderRadius = "12px";
preview.style.display = "none";

bukti.parentNode.appendChild(preview);

// ======================================
// NEXT
// ======================================

nextBtn.addEventListener("click", () => {

    if (nama.value === "") {
        alert("Silakan pilih nama terlebih dahulu.");
        return;
    }

    namaTerpilih.textContent = nama.value;

    page1.classList.add("hidden");
    page2.classList.remove("hidden");

});

// ======================================
// COPY REKENING
// ======================================

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(rekening.textContent);

        copyBtn.textContent = "✅ Nomor rekening berhasil disalin";

        setTimeout(() => {

            copyBtn.textContent = "📋 Salin Nomor Rekening";

        }, 2000);

    } catch {

        alert("Browser tidak mendukung fitur salin otomatis.");

    }

});

// ======================================
// PREVIEW FILE
// ======================================

bukti.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        preview.style.display = "none";
        return;

    }

    // Validasi tipe file

    const allowed = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowed.includes(file.type)) {

        alert("File harus berupa JPG atau PNG.");

        this.value = "";

        preview.style.display = "none";

        return;

    }

    // Maksimal 5MB

    if (file.size > 5 * 1024 * 1024) {

        alert("Ukuran gambar maksimal 5 MB.");

        this.value = "";

        preview.style.display = "none";

        return;

    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

});

// ======================================
// SUBMIT
// ======================================

submitBtn.addEventListener("click", kirimData);

async function kirimData() {

    if (!check.checked) {

        alert("Silakan centang konfirmasi transfer.");

        return;

    }

    if (bukti.files.length === 0) {

        alert("Silakan upload bukti transfer.");

        return;

    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    const file = bukti.files[0];

    const reader = new FileReader();

    reader.onload = async function () {

        const base64 = reader.result.split(",")[1];

        const payload = {

            nama: nama.value,
            filename: file.name,
            image: base64

        };

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            });

            const result = await response.json();

            if (result.success) {

                page2.classList.add("hidden");
                success.classList.remove("hidden");

            } else {

                throw new Error("Server gagal memproses data.");

            }

        }

        catch (err) {

            console.error(err);

            alert("Terjadi kesalahan saat mengirim data.");

            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim";

        }

    };

    reader.readAsDataURL(file);

}
