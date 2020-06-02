
import axios from 'axios';

/* This is basically an axios configuration to standardize our API with
 * the back-end server. baseURL, headers and timeouts are set here.
 */

export default axios.create({
  baseURL: 'http://3.219.109.170:3001/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
  }
});


