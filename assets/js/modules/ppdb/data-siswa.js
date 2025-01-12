// Import helper modules
import { NetworkHelper } from '../../config/networkHelper.js';
import { ENDPOINTS } from '../../config/endpoint.js';
import { showToast } from '../../config/toast.js';
import { navigateToDashboard } from '../../config/back.js';

let isNewRecord = false; // Flag to check if it's a new record

export function init() {
    console.log("Data Siswa Initialized");
    navigateToDashboard();
    const studentRegistrationId = localStorage.getItem('student_registration_id');

    if (!studentRegistrationId) {
        showToast('Student Registration ID tidak ditemukan.', 'warning');
        return;
    }

    getStudentData(studentRegistrationId);

    // Add event listener to the save button
    const saveButton = document.querySelector('.btn-primary');
    saveButton.addEventListener('click', () => saveStudentData(studentRegistrationId));
}

/**
 * Fetch Student Registration by ID dan isi form
 * @param {number} id - Student Registration ID
 */
async function getStudentData(id) {
    try {
        const response = await NetworkHelper.get(ENDPOINTS.STUDENT_REGISTRATIONS.GET_BY_ID(id));
        const studentData = response.data;

        if (studentData) {
            populateForm(studentData);
            isNewRecord = false; // Data exists, so it's an update
        } else {
            throw new Error('Data siswa tidak ditemukan.');
        }
    } catch (error) {
        if (error.message.includes('not found') || error.response?.data?.code === 'NOT_FOUND') {
            showToast('Data siswa tidak ditemukan. Akan membuat data baru.', 'info');
            isNewRecord = true; // Data not found, so it's a new record
        } else {
            console.error('Error fetching student data:', error);
            showToast('Gagal mengambil data siswa.', 'danger');
        }
    }
}

/**
 * Populate form fields dengan data siswa
 * @param {object} data - Data siswa dari API
 */
function populateForm(data) {
    setFieldValue('nis', data.nis);
    setFieldValue('nik', data.nik);
    setFieldValue('nama', data.nama_lengkap);
    setFieldValue('gender', data.jenis_kelamin === 'L' ? 'male' : 'female');
    setFieldValue('birthplace', data.tempat_lahir);
    setFieldValue('birthdate', data.tanggal_lahir);
    setFieldValue('religion', data.agama);
    setFieldValue('bloodtype', data.golongan_darah);
    setFieldValue('height', data.tinggi_badan);
    setFieldValue('weight', data.berat_badan);
    setFieldValue('family-status', data.status_keluarga);
    setFieldValue('child-order', data.anak_ke);
    setFieldValue('siblings', data.jumlah_saudara);
    setFieldValue('disease-history', data.riwayat_penyakit);
    setFieldValue('hobby', data.hobi);
    setFieldValue('achievement', data.prestasi);
    setFieldValue('full-address', data.alamat_lengkap);
    setFieldValue('dusun', data.dusun);
    setFieldValue('rt', data.rt);
    setFieldValue('rw', data.rw);
    setFieldValue('village', data.desa);
    setFieldValue('district', data.kecamatan);
    setFieldValue('regency', data.kabupaten);
    setFieldValue('province', data.provinsi);
    setFieldValue('transportation', data.mode_transportasi);
}

/**
 * Save student data to the server
 * @param {number} studentRegistrationId - Student Registration ID
 */
async function saveStudentData(studentRegistrationId) {
    try {
        const studentData = getFormData();

        if (isNewRecord) {
            // POST request to create a new student registration
            const response = await NetworkHelper.post(ENDPOINTS.STUDENT_REGISTRATIONS.CREATE, studentData);
            showToast('Data siswa berhasil disimpan.', 'success');
            isNewRecord = false; // Switch to update mode after creation
        } else {
            // PUT request to update existing student registration
            const response = await NetworkHelper.put(
                ENDPOINTS.STUDENT_REGISTRATIONS.UPDATE(studentRegistrationId),
                studentData
            );
            showToast('Data siswa berhasil diperbarui.', 'success');
        }
    } catch (error) {
        console.error('Error saving student data:', error);
        showToast('Gagal menyimpan data siswa.', 'danger');
    }
}

/**
 * Get form data as an object
 * @returns {object} Form data
 */
function getFormData() {
    return {
        nis: document.getElementById('nis').value,
        nik: document.getElementById('nik').value,
        nama_lengkap: document.getElementById('nama').value,
        jenis_kelamin: document.getElementById('gender').value === 'male' ? 'L' : 'P',
        tempat_lahir: document.getElementById('birthplace').value,
        tanggal_lahir: document.getElementById('birthdate').value, // Assuming the date input type will return the correct format
        agama: document.getElementById('religion').value,
        golongan_darah: document.getElementById('bloodtype').value,
        tinggi_badan: document.getElementById('height').value,
        berat_badan: document.getElementById('weight').value,
        status_keluarga: document.getElementById('family-status').value,
        anak_ke: document.getElementById('child-order').value,
        jumlah_saudara: document.getElementById('siblings').value,
        riwayat_penyakit: document.getElementById('disease-history').value,
        hobi: document.getElementById('hobby').value,
        prestasi: document.getElementById('achievement').value,
        alamat_lengkap: document.getElementById('full-address').value,
        dusun: document.getElementById('dusun').value,
        rt: document.getElementById('rt').value,
        rw: document.getElementById('rw').value,
        desa: document.getElementById('village').value,
        kecamatan: document.getElementById('district').value,
        kabupaten: document.getElementById('regency').value,
        provinsi: document.getElementById('province').value,
        mode_transportasi: document.getElementById('transportation').value,
    };
}

/**
 * Set value pada input field
 * @param {string} fieldId - ID elemen input
 * @param {string|number} value - Nilai yang akan diisi
 */
function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field && value) {
        field.value = value;
    }
}

/**
 * Format tanggal ke format dd-mm-yyyy
 * @param {string} date - Tanggal dalam format ISO
 * @returns {string} Tanggal dalam format dd-mm-yyyy
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
}
