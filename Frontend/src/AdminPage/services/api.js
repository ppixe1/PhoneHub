import axios from 'axios';

// ชี้ไปยัง URL ของ Backend (ถ้าไม่ได้ตั้งค่าไว้ จะใช้ /api เป็นค่าเริ่มต้น)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
  const { body, headers, ...restOptions } = options;

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
      const detail = error.response?.data?.message || error.message || 'Unknown error';
      throw new Error(`API request failed: ${status} ${statusText} - ${detail}`);
    }

    throw error;
  }
}

// ==========================================
// ฟังก์ชันเรียก API ทั้งหมด (จะยิงไปหา Backend จริงๆ)
// ==========================================

export async function getDashboardData(timeframe = 'today') {
  return request(`/dashboard?timeframe=${encodeURIComponent(timeframe)}`);
}

export async function getProducts() {
  return request('/products');
}

export async function getOrders() {
  return request('/orders');
}

export async function updateOrderStatus(id, status) {
  return request(`/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(product) {
  return request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

// สำหรับอัปโหลดรูปภาพ (ยังคงใช้ LocalStorage ชั่วคราวไปก่อนจนกว่า Backend จะมีระบบรับไฟล์)
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