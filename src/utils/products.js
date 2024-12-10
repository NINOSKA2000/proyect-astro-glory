import api from "./api";

export async function login() {
    const username = import.meta.env.PUBLIC_HEWI_USERNAME;
    const password = import.meta.env.PUBLIC_HEWI_PASSWORD;
    const body = { username, password };
    const url = `${import.meta.env.PUBLIC_HEWI_ENDPOINT}${import.meta.env.PUBLIC_HEWI_LOGIN}`;
    const response = await api.post(url, false, body);
    return response;
}

const productPublic = async(query) => {    
    const url = `${import.meta.env.PUBLIC_HEWI_ENDPOINT}${import.meta.env.PUBLIC_HEWI_SEARCH}`;
    const response = await login();
    const body = {"text": query};
    const { items } = await api.post(url, response.access_token, body);
    return items;
}

export async function fetchProducts(query) {
    return await productPublic(query)
}