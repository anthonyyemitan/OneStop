
import axios from 'axios';


    modifyProduct() {
        axios.post('http://10.106.65.199:4002/product/updateproductinfo', {
            name: '1',
            price: 1,
            pid: 1
        });
        console.log(this.state.productquantity + this.state.storelocationid);
      }
        