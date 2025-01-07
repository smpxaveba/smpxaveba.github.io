import { NetworkHelper } from '../config/networkHelper.js';
import { navigate } from './main.js';
import { ENDPOINTS } from '../config/endpoint.js';
import { showToast } from '../config/toast.js';
export function init() {
    console.log("Auth Register Initialized");

    const registerButton = document.getElementById('registerButton'); // ID tombol
    registerButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Mencegah reload halaman

        // Ambil nilai dari input
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const roleId = 0; // Default role_id
        if (!email || !password) {
            showToast('danger', 'Harap isi semua kolom sebelum melanjutkan.');
            return;
        }
        // Tampilkan modal
        const modal = new bootstrap.Modal(document.getElementById('editUser'));
        modal.show();

        // Ubah isi modal untuk progres
        const modalBody = document.querySelector('#editUser .modal-body');
        modalBody.innerHTML = `
            <div class="text-center">
                <h5>Mohon Tunggu Sebentar...</h5>
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

        try {
            // STEP 1: Kirim data ke endpoint REGISTER
            const registerResponse = await NetworkHelper.post(ENDPOINTS.AUTH.REGISTER, {
                email: email,
                password: password,
                role_id: roleId
            });

            console.log('Register Response:', registerResponse);

            if (registerResponse.message === "User registered successfully") {
                // STEP 2: Kirim email verifikasi
                await NetworkHelper.post(ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL, {
                    email: email
                });

                // Tampilkan pesan sukses di modal
                modalBody.innerHTML = `
                    <div class="text-center text-success">
                        <h5>Registrasi Berhasil!</h5>
                        <p>Silakan cek email Anda untuk verifikasi.</p>
                    </div>
                `;

                // Navigasi ke halaman auth-two-steps.html setelah 2 detik
                setTimeout(() => {
                    modal.hide();
                    localStorage.setItem('email', email); // Simpan email (opsional)
                    navigate('AUTH_TWO_STEPS');
                }, 2000);
            } else {
                throw new Error('Registrasi gagal, respons tidak sesuai.');
            }
        } catch (error) {
            console.error('Register Failed:', error);

            // Handle pesan kesalahan dari server
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                if (errorMessage === "Email and password are required") {
                    modalBody.innerHTML = `
                        <div class="text-center text-danger">
                            <h5>Registrasi Gagal</h5>
                            <p>Pastikan email dan password sudah terisi.</p>
                        </div>
                    `;
                } else if (errorMessage === "Email already exists. Please use another email.") {
                    modalBody.innerHTML = `
                        <div class="text-center text-danger">
                            <h5>Registrasi Gagal</h5>
                            <p>Email ini sudah terdaftar. Silakan gunakan email lain.</p>
                        </div>
                    `;
                } else {
                    modalBody.innerHTML = `
                        <div class="text-center text-danger">
                            <h5>Registrasi Gagal</h5>
                            <p>${errorMessage}</p>
                        </div>
                    `;
                }
            } else {
                modalBody.innerHTML = `
                    <div class="text-center text-danger">
                        <h5>Registrasi Gagal</h5>
                        <p>Silakan coba lagi nanti.</p>
                    </div>
                `;
            }
        }
    });
}
