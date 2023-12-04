import axios from 'axios';

const API_URL = 'http://localhost:8080/products/';

class ProductsService {
  getProducts() {
    return axios.get(API_URL + 'getProducts', this.config).then((response) => {
      return response;
    });
  }
}

export default new ProductsService();
