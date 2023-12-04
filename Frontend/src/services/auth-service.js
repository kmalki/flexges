import axios from 'axios';

const API_URL = 'http://localhost:8080/';

class AuthService {
  login(login, password) {
    return axios
      .post(API_URL + 'users/login', {
        login,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('flexGESemail', response.data.email);
          localStorage.setItem('flexGESenterprise', response.data.enterprise);
          localStorage.setItem('flexGESadmin', response.data.admin);
          localStorage.setItem('flexGESenterpriseId', response.data.enterpriseId);
        }
        return "succes";
      });
  }

  isTokenValid(){
    if(localStorage.getItem('flexGEStokenExp')) {
      if(new Date(localStorage.getItem('flexGEStokenExp')) > Date.now()){
        console.log('Token is valid');
        return true;
      }
    }
    console.log('Token is invalid');
    return false;
  }

  getToken(){
    return axios
    .get(API_URL + 'users/getAccessToken')
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem('flexGEStokenExp', response.data.expirationDate);
        localStorage.setItem('flexGEStoken', response.data.token);
      }
      return "succes";
    });
  }

  logout() {
    localStorage.removeItem('flexGESemail');
    localStorage.removeItem('flexGESenterprise');
    localStorage.removeItem('flexGESadmin');
    localStorage.removeItem('flexGESroomId');
    localStorage.removeItem('flexGEScurrentRoom');
    localStorage.removeItem('flexGESplaced');
    localStorage.removeItem('flexGESenterpriseId');
    localStorage.removeItem('flexGEStokenExp');
    localStorage.removeItem('flexGEStoken');
    localStorage.removeItem('flexGESroom');
    window.location.href = '/login';
  }

  register(username, password, companyName) {
    return axios.post(API_URL + 'users/sign-up', {
      username,
      password,
      companyName,
    });
  }

  registerCompanyWithFile(json, file) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("json", json);

    return axios.post(API_URL + "enterprise/addEnterprise", formData);
  }

  registerUser(json) {
    return axios.post(API_URL + "users/sign-up", json);
  }

  getCurrentUser() {
    return localStorage.getItem('flexGESemail');
  }
}

export default new AuthService();
