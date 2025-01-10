// assets/js/auth.js
import { NetworkHelper } from '../config/networkHelper.js';
import { navigate } from './main.js';
import { ENDPOINTS } from '../config/endpoint.js';

export function init() {
    console.log("Auth Login Initialized");

    const loginButton = document.getElementById('loginButton');
    if (!loginButton) {
        console.error("Login button not found!");
        return;
    }

    const ppdbOnlineButton = document.getElementById('ppdbButton');
    ppdbOnlineButton.addEventListener('click', () => {
        navigate('AUTH_REGISTER_PPDB');
    });


    loginButton.addEventListener('click', async () => {
        // Ambil nilai email dan password dari input
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Harap isi email dan password.');
            return;
        }

        try {
            const response = await NetworkHelper.post(ENDPOINTS.AUTH.LOGIN, {
                email: email,
                password: password
            });

            console.log('Login Response:', response);

            // Simpan token ke localStorage atau sessionStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role_id', response.data.role_id);
            localStorage.setItem('login_as', response.data.login_as);
            localStorage.setItem('email', response.data.email); 
            
            const roleId = response.data.role_id;

            if (roleId === 998) {
                console.log("Navigating to Admin Dashboard");
                navigate('DASHBOARDADMIN');
            } else if (roleId === 2) {
                console.log("Navigating to Guru Dashboard");
                navigate('DASHBOARDGURU');
            } else {
                console.log("Navigating to Default Dashboard");
                navigate('ERROR404LOGIN');
            }
        } catch (error) {
            console.error('Login Failed:', error);

            // Handle jika error response dari server
            const errorMessage = error.response?.data?.message || 'Login gagal. Silakan periksa email dan password Anda.';
            alert(errorMessage);
        }
    });
}
