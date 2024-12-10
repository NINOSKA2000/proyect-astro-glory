import * as CryptoJS from "crypto-js";

async function get(url) {
  const response = await fetch(url);
  return response.json();
}

const post = async (url, authToken, data) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (!!authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return response.json();
}

const post_sec = async (url, data) => {
  const key = CryptoJS.enc.Base64.parse(import.meta.env.PUBLIC_AES_KEY);
  const second_key = CryptoJS.enc.Utf8.parse(import.meta.env.PUBLIC_IV_KEY); 
  const code_1 = CryptoJS.AES.encrypt(data.username, key, {iv: second_key, mode: CryptoJS.mode.CBC}).toString();
  const code_2 = CryptoJS.AES.encrypt(data.password, key, {iv: second_key, mode: CryptoJS.mode.CBC}).toString();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "code_1": code_1,
      "code_2": code_2
    })
  });
  return response.json();
}

export default { get, post, post_sec};