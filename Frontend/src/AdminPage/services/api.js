import axios from 'axios';

// ชี้ไปยัง URL ของ Backend
const BASE_URL = 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

const LOCAL_UPLOADS_PREFIX = 'local-uploads:';

function getLocalUploadKey(file) {
  const safeName = (file.name || `upload-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${LOCAL_UPLOADS_PREFIX}${safeName}`;
}

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read selected image'));
    reader.readAsDataURL(file);
  });
}

function storeLocalImage(file, dataUrl) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { key: null, url: dataUrl };
  }

  try {
    const key = getLocalUploadKey(file);
    window.localStorage.setItem(key, dataUrl);
    return { key, url: dataUrl };
  } catch (error) {
    console.warn('Unable to persist image locally', error);
    return { key: null, url: dataUrl };
  }
}

async function request(path, options = {}) {
  const { body, headers = {}, ...restOptions } = options;

  let token = null;
  if (typeof window !== 'undefined') {
    token = window.sessionStorage.getItem('token') || window.localStorage.getItem('token');
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await apiClient.request({
      url: path,
      headers,
      data: body, 
      ...restOptions,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 'unknown';
      const statusText = error.response?.statusText ?? '';
      const detail = error.response?.data?.msg || error.response?.data?.message || error.message || 'Unknown error';
      throw new Error(`API request failed: ${status} ${statusText} - ${detail}`);
    }
    throw error;
  }
}

// ==========================================
// ฟังก์ชันเรียก API
// ==========================================

export async function getDashboardData(timeframe = 'today') {
  return request(`/dashboard?timeframe=${encodeURIComponent(timeframe)}`);
}

export async function getProducts() {
  return request('/product', { method: 'GET' });
}

export async function getOrders() {
  const response = await request('/order', { method: 'GET' });
  return response && response.orders ? response.orders : [];
}

export async function updateOrderStatus(status, id) {
  let path = '';
  let method = 'PUT';
  let body = undefined;

  if (status === 'shipping') {
    path = `/order/${encodeURIComponent(id)}`;
    body = {
      shipperName: 'Thunder Express',
      trackingNo: 'TH3323598022',
      deliveryPersonName: 'สมชาย ใจดี',
      deliveryPersonPhone: '0888888888',
    };
  } else if (status === 'delivered') {
    path = `/order/delivered/${encodeURIComponent(id)}`;
  } else if (status === 'canceled' || status === 'refunded' || status === 'pending' || status === 'paid') {
    path = `/order/${status}/${encodeURIComponent(id)}`;
  }

  return request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });
}

export async function createProduct(product) {
  return request('/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: product, 
  });
}

export async function updateProduct(id, product) {
  return request(`/product/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: product,
  });
}

export async function deleteProduct(id) {
  return request(`/product/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function uploadProductImage(file) {
  try {
    const dataUrl = await readFileAsDataUrl(file);
    const { url } = storeLocalImage(file, dataUrl);
    return { url };
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error(error.message || 'Unable to upload image locally');
  }
}