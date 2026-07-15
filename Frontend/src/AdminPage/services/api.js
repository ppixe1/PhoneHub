import axios from 'axios';
import { dashboardDatabase, inventoryData, ordersData } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'false' ? false : true;

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

export async function getDashboardData(timeframe = 'today') {
  if (USE_MOCK) {
    return dashboardDatabase[timeframe] || dashboardDatabase.today;
  }

  return request(`/dashboard?timeframe=${encodeURIComponent(timeframe)}`);
}

export async function getInventoryProducts() {
  if (USE_MOCK) {
    return inventoryData;
  }

  return request('/products');
}

export async function getOrders() {
  if (USE_MOCK) {
    return ordersData;
  }

  return request('/orders');
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) {
    const order = ordersData.find((item) => item.id === id);
    if (order) order.status = status;
    return order;
  }

  return request(`/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(product) {
  if (USE_MOCK) {
    const nextId = String(Math.max(...inventoryData.map((item) => Number(item.id) || 0), 100) + 1);
    const newProduct = { id: nextId, ...product };
    inventoryData.push(newProduct);
    return newProduct;
  }

  return request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  if (USE_MOCK) {
    const index = inventoryData.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Product not found');
    inventoryData[index] = { ...inventoryData[index], ...product };
    return inventoryData[index];
  }

  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  if (USE_MOCK) {
    const index = inventoryData.findIndex((item) => item.id === id);
    if (index !== -1) inventoryData.splice(index, 1);
    return { success: true };
  }

  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function uploadProductImage(file) {
  if (USE_MOCK) {
    return { url: URL.createObjectURL(file) };
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const { url } = storeLocalImage(file, dataUrl);
    return { url };
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error(error.message || 'Unable to upload image locally');
  }
}