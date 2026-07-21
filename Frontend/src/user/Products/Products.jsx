import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif",
};

// URL สำหรับเชื่อมต่อ API
const API_BASE_URL = 'http://localhost:3000';

const categories = [
  {
    id: 'all',
    name: 'ทั้งหมด',
    color: '#ffffff',
    img: '/images/togetherdotai-mono.svg',
  },
  {
    id: 'apple',
    name: 'Apple',
    color: '#ffffff',
    img: '/images/apple-light.svg',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    color: '#ffffff',
    img: '/images/samsung.svg',
  },
  { id: 'vivo', name: 'Vivo', color: '#ffffff', img: '/images/vivo.svg' },
  { id: 'oppo', name: 'Oppo', color: '#ffffff', img: '/images/oppo.svg' },
  { id: 'xiaomi', name: 'Xiaomi', color: '#ffffff', img: '/images/xiaomi.svg' },
];

export default function Products({
  cartCount = 0,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State สำหรับการเลือก
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate()

  const clearSelected = () => {
    setSelectedProduct(null);
    setSelectedColor(null);
    setSelectedStorage(null);
    setSelectedPrice(null);
    setSelectedQuantity(1);
  }

  const onLogout = () => {
    navigate('/login')
  }

  const onViewCart = () => {
    navigate('/cart')
  }

  const onViewOrderHistory = () => {
    navigate('/order-history')
  }

  const onAddToCart = () => {
    const token = sessionStorage.getItem('token')
    if (!token) return alert('คุณไม่มี Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง')

    if (!selectedProduct || !selectedProduct.rawVariations) {
      console.error("ไม่มีข้อมูลสินค้า");
      return;
    }

    const variations = selectedProduct.rawVariations;
    const matchedVariation = variations.find(item => 
      item.storage === selectedStorage && item.color === selectedColor.name
  );

    if (selectedColor.name === null || selectedStorage === null || matchedVariation.price === null || selectedQuantity === null || selectedProduct === null) return alert('กรุณาเลือกสเปกสินค้าที่ต้องการก่อนเพิ่มในตะกร้า')
    axios.post(`${API_BASE_URL}/cart`, {
      product_id: selectedProduct.id,
      color: selectedColor.name,
      storage: selectedStorage,
      price: matchedVariation.price,
      quantity: selectedQuantity,
      brand: selectedProduct.brand,
      model: selectedProduct.name,
      img: selectedProduct.img
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (!res) return alert('เกิดข้อผิดพลาด');
      if (res.status === 200) {
        alert(res.data.msg);
        
      }
    })
  }

  // ฟังก์ชันสำหรับแปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ Frontend ใช้งานง่ายขึ้น
  const transformProductData = (apiProducts) => {
    return apiProducts.map((p) => {
      // 1. แปลงรูปภาพ
      let parsedImg = [];
      try {
        parsedImg = JSON.parse(p.img);
      } catch (e) {
        parsedImg = [p.img];
      }
      const mainImage = parsedImg.length > 0 ? parsedImg[0] : '/images/placeholder.webp';

      // 2. แปลงสเปก
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(p.specifications);
      } catch (e) {}

      // 3. แปลง Variation
      let parsedVars = [];
      try {
        parsedVars = JSON.parse(p.variation);
      } catch (e) {}

      // หาชนิดของสีและความจุทั้งหมด (ลบตัวซ้ำออก)
      const uniqueStorages = [...new Set(parsedVars.map((v) => v.storage))];
      const colorsMap = {};
      
      parsedVars.forEach((v) => {
        if (!colorsMap[v.color]) {
          colorsMap[v.color] = {
            name: v.color,
            stock: Number(v.stock),
          };
        } else {
          colorsMap[v.color].stock += Number(v.stock);
        }
      });
      const uniqueColors = Object.values(colorsMap);

      // หาราคาต่ำสุดเพื่อใช้แสดงเป็นราคาเริ่มต้น
      const minPrice = parsedVars.length > 0 
        ? Math.min(...parsedVars.map(v => Number(v.price))) 
        : 0;

      return {
        id: p.id,
        name: p.model,
        brand: p.brand,
        img: mainImage,
        category: p.brand ? p.brand.toLowerCase() : 'other',
        
        rawVariations: parsedVars, 
        colors: uniqueColors,
        storages: uniqueStorages,
        basePrice: minPrice,
        
        specs: {
          screenSize: parsedSpecs.screenSize || '-',
          screenType: parsedSpecs.screenType || '-',
          refreshRate: parsedSpecs.refreshRate || '-',
          chipset: parsedSpecs.chipset || '-',
          backCamera: parsedSpecs.backCamera || '-',
          frontCamera: parsedSpecs.frontCamera || '-',
          batteryLife: parsedSpecs.batteryLife || '-',
          fastCharge: parsedSpecs.fastCharge || '-',
          os: parsedSpecs.os || '-',
          connection: parsedSpecs.connections || '-',
        },
        highlights: parsedSpecs.highlights || '',
      };
    });
  };

  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/product/`);
        const formattedData = transformProductData(response.data);
        setProducts(formattedData);
        setError(null);
      } catch (err) {
        console.error('เชื่อมต่อหลังบ้านไม่สำเร็จ', err);
        setError('ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาตรวจสอบ API');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateProductView = (id) => {
    if (!id) return
    
    axios.put(`${API_BASE_URL}/product/view/${id}`)
    .then((res) => {
      if (res.status === 200) {
        alert(res.data.msg);
      }
    })
  }

  // ตั้งค่า Default สีและความจุ เมื่อเปิดดูหน้ารายละเอียดสินค้า
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        setSelectedColor(selectedProduct.colors[0]);
      } else {
        setSelectedColor(null);
      }
      
      if (selectedProduct.storages && selectedProduct.storages.length > 0) {
        setSelectedStorage(selectedProduct.storages[0]);
      } else {
        setSelectedStorage(null);
      }
    }
  }, [selectedProduct]);

  const handleClearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const filteredProducts = products.filter((p) => {
    const productName = p.name || '';
    const matchesSearch = productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesMinPrice = minPrice === '' || p.basePrice >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.basePrice <= Number(maxPrice);

    return (
      matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });

  const Header = () => (
    <div className='position-sticky top-0 z-3'
      style={{
        backgroundColor: theme.primary,
        color: '#fff',
        padding: '15px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxHeight: '60px',
      }}
    >
      <div className='d-flex justify-content-start align-items-center object-fit-contain' style={{ width: '150px' }}>
        <img className='w-100 h-100 object-fit-contain' src="/PhoneHubLOGO.png" style={{cursor:'pointer'}} onClick={() => {
          navigate('/home')
          window.scrollTo(0, 0);
          }} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '25px',
          fontSize: '16px',
          fontFamily: theme.fontFamily,
          alignItems: 'center',
        }}
      >
        <span
          className='d-flex align-items-center'
          style={{ cursor: 'pointer', fontFamily: theme.fontFamily }}
          onClick={() => {
            clearSelected();
            handleClearFilter();
            window.scrollTo(0, 0);
          }}
        >
          <i className="bi bi-house me-2 fs-4"></i>
          หน้าหลัก
        </span>

        <div
          onClick={onViewCart}
          style={{
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <svg
            width='26'
            height='26'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#ffffff'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='9' cy='21' r='1' />
            <circle cx='20' cy='21' r='1' />
            <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
          </svg>
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                backgroundColor: '#ffd700',
                color: '#000000',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: theme.fontFamily,
                lineHeight: 1,
                border: `1px solid ${theme.primary}`,
              }}
            >
              {cartCount}
            </span>
          )}
        </div>

        <div style={{ cursor: 'pointer' }} onClick={onViewOrderHistory}>
          <i className="bi bi-clipboard2-minus fs-4"></i>
        </div>

        <div
          onClick={onLogout || (() => alert('ออกจากระบบเรียบร้อย!'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#ffffff'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
            <polyline points='16 17 21 12 16 7' />
            <line x1='21' y1='12' x2='9' y2='12' />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: theme.fontFamily }}>
            ออกจากระบบ
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: theme.fontFamily }}>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${theme.background}`, borderTop: `4px solid ${theme.primary}`, borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
          <p>กำลังโหลดข้อมูลสินค้าจากเซิร์ฟเวอร์...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: theme.fontFamily }}>
        <div style={{ textAlign: 'center', color: theme.primary }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>ลองอีกครั้ง</button>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    const currentVariation = selectedProduct.rawVariations?.find(
      (v) => v.color === selectedColor?.name && v.storage === selectedStorage
    );

    const currentPrice = currentVariation ? Number(currentVariation.price) : selectedProduct.basePrice;
    const currentStock = currentVariation ? Number(currentVariation.stock) : 0;
    const isOutOfStock = currentVariation && currentStock === 0;


    return (
      <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{ fontSize: '14px', color: '#666', marginBottom: '20px', cursor: 'pointer', fontFamily: theme.fontFamily }}
            onClick={() => { clearSelected(); }}
          >
            หน้าแรก &gt; {selectedProduct.brand} {selectedProduct.name}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <div style={{ height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '10px' }}>
              <img src={selectedProduct.img} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span style={{ backgroundColor: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
                  {selectedProduct.brand}
                </span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 10px 0', fontFamily: theme.fontFamily, color: '#333' }}>
                {selectedProduct.name} {selectedStorage && `(${selectedStorage})`}
              </h2>

              <div style={{ margin: '0 0 15px 0' }}>
                <span style={{ fontSize: '26px', fontWeight: 'bold', color: theme.primary, fontFamily: theme.fontFamily }}>
                  ฿{currentPrice.toLocaleString()}
                </span>
                {!currentVariation && (
                  <span style={{ fontSize: '14px', color: '#888', marginLeft: '10px', fontWeight: 'normal' }}>
                    (ราคาเริ่มต้น กรุณาเลือกความจุและสี)
                  </span>
                )}
              </div>

              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div style={{ marginBottom: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                    ตัวเลือกสี: {selectedColor ? <strong style={{ color: theme.primary }}>{selectedColor.name}</strong> : 'โปรดเลือกสี'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProduct.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          padding: '8px 16px',
                          border: selectedColor?.name === color.name ? `2px solid ${theme.primary}` : '1.5px solid #ddd',
                          borderRadius: '20px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          outline: 'none',
                          color: selectedColor?.name === color.name ? theme.primary : '#333',
                          fontWeight: selectedColor?.name === color.name ? 'bold' : 'normal',
                          fontFamily: theme.fontFamily,
                        }}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.storages && selectedProduct.storages.length > 0 && (
                <div style={{ marginBottom: '25px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                    ความจุ: {selectedStorage ? <strong style={{ color: theme.primary }}>{selectedStorage}</strong> : 'โปรดเลือกความจุ'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProduct.storages.map((storage, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedStorage(storage)}
                        style={{
                          padding: '8px 16px',
                          border: selectedStorage === storage ? `2px solid ${theme.primary}` : '1.5px solid #ddd',
                          borderRadius: '8px',
                          backgroundColor: selectedStorage === storage ? `${theme.primary}08` : '#fff',
                          cursor: 'pointer',
                          color: selectedStorage === storage ? theme.primary : '#333',
                          fontWeight: selectedStorage === storage ? 'bold' : 'normal',
                          outline: 'none',
                          transition: 'all 0.2s',
                          fontFamily: theme.fontFamily,
                        }}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentVariation && (
                <div style={{ marginBottom: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  {isOutOfStock ? (
                    <div style={{ fontSize: '14px', color: '#d32f2f', fontWeight: '500' }}>
                      สินค้าหมดชั่วคราวสำหรับตัวเลือกนี้
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                        จำนวน:
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        
                        {/* Group ปุ่มปรับจำนวน */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                          <button
                            onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                            disabled={selectedQuantity <= 1}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: selectedQuantity <= 1 ? '#f9f9f9' : '#fff',
                              border: 'none',
                              borderRight: '1.5px solid #ddd',
                              cursor: selectedQuantity <= 1 ? 'not-allowed' : 'pointer',
                              fontSize: '18px',
                              color: selectedQuantity <= 1 ? '#ccc' : '#333',
                              fontFamily: theme.fontFamily,
                              transition: 'background-color 0.2s'
                            }}
                          >
                            -
                          </button>
                          
                          <div style={{ padding: '8px 20px', fontSize: '16px', fontWeight: 'bold', minWidth: '45px', textAlign: 'center', backgroundColor: '#fff' }}>
                            {selectedQuantity}
                          </div>
                          
                          <button
                            onClick={() => setSelectedQuantity(prev => Math.min(currentStock, prev + 1))}
                            disabled={selectedQuantity >= currentStock}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: selectedQuantity >= currentStock ? '#f9f9f9' : '#fff',
                              border: 'none',
                              borderLeft: '1.5px solid #ddd',
                              cursor: selectedQuantity >= currentStock ? 'not-allowed' : 'pointer',
                              fontSize: '18px',
                              color: selectedQuantity >= currentStock ? '#ccc' : '#333',
                              fontFamily: theme.fontFamily,
                              transition: 'background-color 0.2s'
                            }}
                          >
                            +
                          </button>
                        </div>
                        
                        <span style={{ fontSize: '14px', color: '#2e7d32', fontWeight: '500' }}>
                          มีสินค้าพร้อมส่ง ({currentStock} ชิ้น)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={isOutOfStock || !currentVariation}
                onClick={() => onAddToCart()}
                style={{
                  backgroundColor: isOutOfStock || !currentVariation ? '#ccc' : theme.primary,
                  color: '#fff',
                  border: 'none',
                  width: '100%',
                  padding: '14px 30px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: isOutOfStock || !currentVariation ? 'not-allowed' : 'pointer',
                  fontFamily: theme.fontFamily,
                }}
              >
                {isOutOfStock ? 
                <span className='d-flex justify-content-center align-items-center gap-2'>
                  <i class="bi bi-x-square"></i>
                  สินค้าหมดชั่วคราว
                </span>
                : !currentVariation ? 
                <span className='d-flex justify-content-center align-items-center gap-2'>
                  <i className="bi bi-info-circle"></i>
                  กรุณาเลือกสีและความจุ
                </span>
                : 
                <span className='d-flex justify-content-center align-items-center gap-2'>
                  <svg
                    width='26'
                    height='26'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#ffffff'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='9' cy='21' r='1' />
                    <circle cx='20' cy='21' r='1' />
                    <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
                  </svg>
                  เพิ่มลงตะกร้า
                </span>
                }
              </button>
            </div>
          </div>

          <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', borderBottom: '1.5px solid #eee', paddingBottom: '12px', color: '#222', fontFamily: theme.fontFamily }}>
              รายละเอียดสินค้าเพิ่มเติม
            </h3>

            {selectedProduct.specs && (
              <div style={{ margin: '0 0 25px 0', padding: '20px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #eef2f5' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#444' }}>สเปกทางเทคนิค</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px 20px', fontSize: '16px', color: '#555' }}>
                  <div><strong>ขนาดหน้าจอ:</strong> {selectedProduct.specs.screenSize}</div>
                  <div><strong>ประเภทหน้าจอ:</strong> {selectedProduct.specs.screenType}</div>
                  <div><strong>Refresh Rate:</strong> {selectedProduct.specs.refreshRate}</div>
                  <div><strong>ชิปเซ็ต (CPU):</strong> {selectedProduct.specs.chipset}</div>
                  <div><strong>กล้องหลัง:</strong> {selectedProduct.specs.backCamera}</div>
                  <div><strong>กล้องหน้า:</strong> {selectedProduct.specs.frontCamera}</div>
                  <div><strong>แบตเตอรี่:</strong> {selectedProduct.specs.batteryLife}</div>
                  <div><strong>ชาร์จไว:</strong> {selectedProduct.specs.fastCharge}</div>
                  <div><strong>ระบบปฏิบัติการ:</strong> {selectedProduct.specs.os}</div>
                  <div><strong>การเชื่อมต่อ:</strong> {selectedProduct.specs.connection}</div>
                </div>
              </div>
            )}

            {selectedProduct.highlights && selectedProduct.highlights !== '-' && (
              <div style={{ margin: '15px 0', padding: '15px', backgroundColor: '#F5F9FF', borderRadius: '6px', borderLeft: `4px solid #1E88E5` }}>
                <strong style={{ fontSize: '14px', color: '#0D47A1', display: 'block', marginBottom: '5px' }}>ไฮไลท์:</strong>
                <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: 1.5 }}>{selectedProduct.highlights}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <Header />

      {/* NEW PROMOTIONAL BANNER: iPhone 17 Pro Max */}
      <div style={{ padding: '30px 5% 10px 5%' }}>
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #fc8f4b 0%, #db6932 100%)', 
            borderRadius: '16px', 
            padding: '40px 60px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            color: '#fff', 
            minHeight: '280px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* ข้อมูลเนื้อหาซีกซ้าย */}
          <div style={{ zIndex: 2, maxWidth: '55%' }}>
            <p style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: '#FFD129', fontWeight: 'bold', margin: '0 0 10px 0', fontFamily: theme.fontFamily }}>
              — NEW RELEASE
            </p>
            <h2 style={{ fontSize: '46px', fontWeight: 'bold', lineHeight: '1.1', margin: '0 0 15px 0', fontFamily: theme.fontFamily, letterSpacing: '-0.5px' }}>
              iPhone 17 Pro Max
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.85, margin: '0 0 25px 0', lineHeight: '1.6', fontFamily: theme.fontFamily }}>
              ก้าวข้ามทุกขีดจำกัดด้วยชิป A19 Pro ที่ทรงพลังที่สุด พร้อมระบบกล้องโปร 48MP ทั้งสามตัวที่เก็บรายละเอียดได้คมชัดสูงสุด และเพลิดเพลินกับการใช้งานยาวนานต่อเนื่องสูงสุดถึง 37 ชั่วโมง บนหน้าจอขนาดใหญ่เต็มตา 6.9 นิ้ว
            </p>
            <button 
              onClick={() => {
                // ค้นหา iPhone 17 Pro Max ในรายชื่อผลิตภัณฑ์แล้วสลับหน้ารายละเอียดทันที
                const targetProduct = products.find(p => p.name.toLowerCase().includes('iphone 17 pro max'));
                if (targetProduct) {
                  setSelectedProduct(targetProduct);
                } else {
                  // Fallback: เลื่อนหน้าจอลงไปดูกริตสินค้าหลัก
                  window.scrollTo({ top: 550, behavior: 'smooth' });
                }
              }}
              style={{ 
                backgroundColor: '#fff', 
                color: '#111', 
                border: 'none', 
                padding: '12px 30px', 
                borderRadius: '25px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                fontSize: '14px',
                fontFamily: theme.fontFamily,
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = '#f5f5f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              สัมผัสความโปรเลยวันนี้ →
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '30px 5% 10px 5%' }}>
        <h2 className='mb-1' style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px' }}>หมวดหมู่สินค้า</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
          {categories.map((cat) => (
            <div key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ backgroundColor: cat.color, padding: '20px 10px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', border: selectedCategory === cat.id ? `2px solid ${theme.primary}` : '2px solid transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '90px', height: '90px', backgroundColor: '#fff', borderRadius: '50%', margin: '0 auto 12px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <img src={cat.img} alt={cat.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <div style={{ margin: '20px 5% 0 5%', padding: '16px 24px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ fontSize: '15px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: theme.primary }}>ตัวกรอง</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '250px', maxWidth: '400px' }}>
          <input type='text' placeholder='ค้นหาสินค้าที่ต้องการ...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '8px 15px', border: '1.5px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#555' }}>ช่วงราคา (บาท):</span>
          <input type='number' placeholder='ต่ำสุด' value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
          <span style={{ color: '#ccc' }}>—</span>
          <input type='number' placeholder='สูงสุด' value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', outline: 'none' }} />
          {(minPrice || maxPrice || selectedCategory !== 'all' || searchTerm) && (
            <button onClick={handleClearFilter} style={{ padding: '8px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>ล้างตัวกรอง</button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ padding: '20px 5% 40px 5%' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
            ไม่พบสินค้าที่ตรงกับเงื่อนไข
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  window.scrollTo(0, 0);
                  updateProductView(product.id);
                }}
                style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ height: '180px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={product.img} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', height: '40px', overflow: 'hidden', color: '#333' }}>
                  <span className='badge bg-color-primary'>{product.brand}</span><br />
                  {product.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '20px', color: theme.primary, fontWeight: 'bold' }}>
                    ฿{product.basePrice.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}