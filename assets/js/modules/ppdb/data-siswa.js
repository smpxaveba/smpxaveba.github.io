// import { NetworkHelper } from '../../config/networkHelper.js';
// import { ENDPOINTS } from '../../config/endpoint.js';
// import { navigate } from '../main.js';


export function init() {
    console.log("Auth Register Initialized");

    const userNameElement = document.querySelector(".flex-grow-1 h6");
    const userRoleElement = document.querySelector(".flex-grow-1 small");

    const userName = localStorage.getItem("email") || "Unknown User";
    const roleId = localStorage.getItem("role-ppdb") || "Unknown Role";

    let userRole = "Unknown Role";
    if (roleId) {
        switch (parseInt(roleId, 10)) {
            case 777:
                userRole = "Calon Siswa";
                break;
            
        }
    }

    if (userNameElement) userNameElement.textContent = userName;
    if (userRoleElement) userRoleElement.textContent = userRole;

}
