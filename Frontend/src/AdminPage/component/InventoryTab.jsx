import React, { useState, useRef } from "react";
import { Trash2, Plus, Search, Eye, AlertCircle, Image as ImageIcon, Tag, Cpu, Palette, Sparkles, X, ChevronDown, ListFilter, CheckCircle2 } from "lucide-react";
import { inventoryData } from "../data/mockData";

export default function InventoryTab() {
  const getInitialProducts = () => {
    try {
      if (!inventoryData || inventoryData.length === 0) return [];
      
      return inventoryData.map((item, idx) => {
        const colors = item.colors && item.colors.length > 0 
          ? item.colors 
          : [{ name: "Default", stock: item.stock || 0 }];
          
        const totalStock = colors.reduce((sum, c) => sum + (c.stock || 0), 0);
        const mockViews = item.views || (Math.floor(Math.random() * 10000) + 1000).toLocaleString();
        const mockSold = item.sold || Math.floor(Math.random() * 500) + 50;

        return {
          id: item.id || `10${idx + 1}`,
          name: item.name,
          capacity: item.capacity || "256GB",
          brand: item.brand || item.category || "Apple",
          image: item.image,
          price: String(item.price).replace(".-", ""),
          views: mockViews,
          sold: mockSold,
          totalStock: totalStock,
          colors: colors
        };
      });
    } catch (e) {
      console.error("Error creating products:", e);
      return [];
    }
  };

  const [products, setProducts] = useState(() => getInitialProducts());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State สำหรับ Custom Dropdown
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "", name: "", brand: "Apple", ram: "8", rom: "256", price: "", promoPrice: "", privilege: "",
    screenSize: "", screenType: "", refreshRate: "", cpu: "", rearCam: "", frontCam: "", battery: "",
    charging: "", os: "", connectivity: "", colors: [{ name: "", stock: "" }], features: [""], image: ""
  });
  
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  // ตัวเลือกสำหรับ Dropdown พร้อมไอคอนแท้
  const statusOptions = [
    { value: 'ทั้งหมด', label: 'สถานะทั้งหมด', icon: <ListFilter size={16} color="#6C757D" /> },
    { value: 'ขายอยู่', label: 'ขายอยู่ (มีสต็อก)', icon: <CheckCircle2 size={16} color="#2E7D32" /> },
    { value: 'สินค้าหมด', label: 'สินค้าหมด (สต็อก 0)', icon: <AlertCircle size={16} color="#DC2626" /> }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
    const isOutOfStock = p.totalStock <= 0;
    
    const matchesStatus = 
      statusFilter === "ทั้งหมด" || 
      (statusFilter === "ขายอยู่" && !isOutOfStock) ||
      (statusFilter === "สินค้าหมด" && isOutOfStock);
      
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    setFormData({
      id: "", name: "", brand: "Apple", ram: "8", rom: "256", price: "", promoPrice: "", privilege: "",
      screenSize: "", screenType: "", refreshRate: "", cpu: "", rearCam: "", frontCam: "", battery: "",
      charging: "", os: "", connectivity: "", colors: [{ name: "", stock: "" }], features: [""], image: ""
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      ...formData,
      id: product.id,
      name: product.name,
      brand: product.brand,
      rom: product.capacity ? product.capacity.replace('GB', '') : "256",
      price: product.price,
      colors: product.colors.length > 0 ? product.colors : [{ name: "", stock: "" }],
      image: product.image,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleAddColor = () => setFormData({ ...formData, colors: [...formData.colors, { name: "", stock: "" }] });
  const handleRemoveColor = (index) => {
    const newColors = [...formData.colors];
    newColors.splice(index, 1);
    setFormData({ ...formData, colors: newColors });
  };
  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const handleAddFeature = () => setFormData({ ...formData, features: [...formData.features, ""] });
  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalStock = formData.colors.reduce((sum, c) => sum + (parseInt(c.stock) || 0), 0);
    
    const formattedProduct = {
      id: editingId ? editingId : `10${products.length + 1}`,
      name: formData.name,
      capacity: `${formData.rom}GB`,
      brand: formData.brand,
      image: formData.image || "https://via.placeholder.com/150",
      price: formData.price,
      views: editingId ? products.find(p => p.id === editingId).views : "0",
      sold: editingId ? products.find(p => p.id === editingId).sold : "0",
      totalStock: totalStock,
      colors: formData.colors
    };

    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? { ...p, ...formattedProduct } : p)));
    } else {
      setProducts([...products, formattedProduct]);
    }
    setShowModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* 1. ส่วนหัวกล่องแดงหลัก */}
      <div className="rounded-4 overflow-hidden shadow-sm border mb-4" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>
            จัดการคลังสินค้า (Inventory)
          </h2>
          <p className="m-0 text-white-50" style={{ paddingLeft: '24px' }}>จัดการสินค้าและสต็อก</p>
        </div>
      </div>

      <div className="px-1">
        {/* 2. แถบส่วนหัวตาราง (Dropdown + Search + Add Button) */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          
          <div className="d-flex flex-column flex-sm-row gap-2 w-100" style={{ maxWidth: '560px' }}>
            
            {/* Custom Dropdown สถานะ */}
            <div className="position-relative" style={{ minWidth: '180px' }}>
              <div 
                className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
                style={{ 
                  borderRadius: '12px', 
                  padding: '10px 16px', 
                  cursor: 'pointer',
                  borderColor: isFilterOpen ? '#B00000' : '#e9ecef',
                  transition: 'all 0.2s'
                }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <div className="d-flex align-items-center gap-2">
                  {statusOptions.find(opt => opt.value === statusFilter)?.icon}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                    {statusOptions.find(opt => opt.value === statusFilter)?.label}
                  </span>
                </div>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    color: '#6c757d', 
                    transform: isFilterOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.3s ease' 
                  }} 
                />
              </div>

              {isFilterOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setIsFilterOpen(false)}></div>
                  <div 
                    className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" 
                    style={{ zIndex: 50, borderRadius: '12px', borderColor: '#e9ecef' }}
                  >
                    {statusOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                        style={{
                          fontSize: '14px',
                          cursor: 'pointer',
                          backgroundColor: statusFilter === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent',
                          color: statusFilter === opt.value ? '#B00000' : '#495057',
                          fontWeight: statusFilter === opt.value ? '600' : '500',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => { if(statusFilter !== opt.value) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
                        onMouseLeave={(e) => { if(statusFilter !== opt.value) e.currentTarget.style.backgroundColor = 'transparent' }}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setIsFilterOpen(false);
                        }}
                      >
                        {opt.icon}
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ช่องค้นหา */}
            <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
              <span className="input-group-text bg-white border-end-0" style={{ paddingLeft: '16px' }}>
                <Search size={18} style={{ color: "#999" }} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-2 shadow-none"
                placeholder="ค้นหารหัส หรือ ชื่อสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '10px 0' }}
              />
            </div>
          </div>

          <button
            className="btn d-flex align-items-center justify-content-center gap-2 px-4 py-2 shadow-sm flex-shrink-0"
            style={{ backgroundColor: "#B00000", color: "white", fontSize: "14px", fontWeight: "600", borderRadius: '12px' }}
            onClick={handleAddProduct}
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* ตารางสินค้า */}
        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0" style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: '#B00000', color: 'white', fontSize: '14px' }}>
                  <th className="py-3 px-4" style={{ width: '8%' }}>รหัส</th>
                  <th className="py-3" style={{ width: '10%' }}>รูปภาพ</th>
                  <th className="py-3" style={{ width: '22%' }}>ชื่อสินค้า</th>
                  <th className="py-3 text-center" style={{ width: '12%' }}>ราคา (บาท)</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>ยอดเข้าดู</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>ขายแล้ว</th>
                  <th className="py-3" style={{ width: '15%' }}>สต็อกแยกตามสี</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>สถานะ</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.totalStock <= 0;

                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid #f8f9fa', height: '110px' }}>
                      <td className="px-4 text-muted fw-semibold" style={{ fontSize: '14px' }}>#{product.id}</td>
                      <td>
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px', borderRadius: '12px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isOutOfStock ? 0.6 : 1 }} />
                        </div>
                      </td>
                      <td>
                        <div className={`fw-bold mb-1 ${isOutOfStock ? 'text-muted' : 'text-dark'}`} style={{ fontSize: '15px' }}>{product.name}</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>ความจุ: {product.capacity} | แบรนด์: {product.brand}</div>
                      </td>
                      <td className="text-center fw-bold" style={{ color: isOutOfStock ? '#6c757d' : '#B00000', fontSize: '15px' }}>{product.price}</td>
                      <td className="text-center text-muted" style={{ fontSize: '14px' }}><Eye size={14} className="me-1 d-inline" /> {product.views}</td>
                      <td className="text-center fw-bold text-dark" style={{ fontSize: '14px' }}>{product.sold} <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>ชิ้น</span></td>
                      
                      <td className="py-3">
                        <div className="d-flex flex-column mx-auto" style={{ minWidth: '150px', maxWidth: '180px' }}>
                          <div className={`fw-bold mb-2 text-center ${isOutOfStock ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                            รวม: {product.totalStock} เครื่อง
                          </div>
                          <div 
                            style={{ 
                              maxHeight: '52px', 
                              overflowY: product.colors.length > 2 ? 'auto' : 'visible',
                              overflowX: 'hidden',
                              paddingRight: product.colors.length > 2 ? '4px' : '0'
                            }}
                            className="custom-scrollbar"
                          >
                            {product.colors.map((c, idx) => (
                              <div key={idx} className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '13px' }}>
                                <span className="text-muted text-truncate me-2" style={{ maxWidth: '110px' }}>
                                  - {c.name || 'ไม่ระบุสี'}
                                </span>
                                <span className={`fw-bold flex-shrink-0 ${c.stock > 0 ? 'text-success' : 'text-danger'}`}>
                                  {c.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      
                      <td className="text-center">
                        <span 
                          className="badge rounded-pill d-inline-flex align-items-center justify-content-center gap-1 shadow-sm"
                          style={{ 
                            backgroundColor: isOutOfStock ? '#FEF2F2' : '#E8F5E9', 
                            color: isOutOfStock ? '#DC2626' : '#2E7D32', 
                            border: `1px solid ${isOutOfStock ? '#FECACA' : '#C8E6C9'}`, 
                            padding: '6px 12px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            transition: 'all 0.3s'
                          }}
                        >
                          {isOutOfStock ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />} 
                          {isOutOfStock ? "สินค้าหมด" : "ขายอยู่"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button className="btn btn-sm d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ backgroundColor: "#FFD129", color: "#000", width: '50px', fontSize: '13px', borderRadius: '10px' }} onClick={() => handleEditProduct(product)}>แก้ไข</button>
                          <button className="btn btn-sm d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ backgroundColor: "#FEE2E2", color: "#DC2626", width: '50px', fontSize: '13px', borderRadius: '10px' }} onClick={() => handleDeleteProduct(product.id)}>ลบ</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan="9" className="text-center py-5 text-muted">ไม่พบข้อมูลสินค้าที่ค้นหา</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal เพิ่ม/แก้ไขสินค้า */}
        {showModal && (
          <div
            className="position-fixed"
            style={{
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1050, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-light rounded-4 shadow-lg d-flex flex-column overflow-hidden"
              style={{ width: "95%", maxWidth: "720px", maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#B00000', color: 'white' }}>
                <h4 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: '18px' }}>
                  <Plus size={20} /> {editingId ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่เข้าคลัง"}
                </h4>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-auto p-4" style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
                
                {/* Section รูปภาพ */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold d-flex align-items-center gap-2 text-dark" style={{ fontSize: '15px' }}>
                      <ImageIcon size={18} color="#B00000" /> รูปภาพสินค้า 
                      <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>(สูงสุด 10 รูป แนะนำภาพทุกมุม)</span>
                    </span>
                    <span className="text-danger fw-bold" style={{ fontSize: '14px' }}>{formData.image ? '1' : '0'} / 10</span>
                  </div>
                  <div className="d-flex gap-3">
                    <input type="file" className="d-none" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                    <div 
                      className="rounded-4 d-flex flex-column align-items-center justify-content-center bg-light" 
                      style={{ width: '100px', height: '100px', cursor: 'pointer', border: '2px dashed #ccc' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus size={24} color="#999" />
                      <span style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>เพิ่มรูป</span>
                    </div>
                    {formData.image && (
                      <div className="position-relative" style={{ width: '100px', height: '100px' }}>
                        <img src={formData.image} alt="preview" className="rounded-4 border" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1" style={{ width: '24px', height: '24px' }} onClick={() => setFormData({...formData, image: ''})}>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 1 */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Tag size={18} color="#B00000" /> 1. ข้อมูลพื้นฐาน
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชื่อรุ่นและยี่ห้อ <span className="text-danger">*</span></label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น iPhone 15 Pro Max" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>แบรนด์ <span className="text-danger">*</span></label>
                      <select className="form-select shadow-sm" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6', cursor: 'pointer' }}>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>RAM (GB)</label>
                      <input type="number" className="form-control shadow-sm" placeholder="8" value={formData.ram} onChange={(e) => setFormData({ ...formData, ram: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ROM (GB)</label>
                      <select className="form-select shadow-sm" value={formData.rom} onChange={(e) => setFormData({ ...formData, rom: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6', cursor: 'pointer' }}>
                        <option value="128">128</option>
                        <option value="256">256</option>
                        <option value="512">512</option>
                        <option value="1024">1TB</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ราคาเต็ม (บาท) <span className="text-danger">*</span></label>
                      <input type="number" className="form-control shadow-sm" placeholder="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ราคาโปรโมชั่น (ถ้ามี)</label>
                      <input type="number" className="form-control shadow-sm" placeholder="0" value={formData.promoPrice} onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>สิทธิพิเศษ (เช่น ผ่อน 0%, เบอร์ใหม่)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น ผ่อน 0% นานสูงสุด 10 เดือน" value={formData.privilege} onChange={(e) => setFormData({ ...formData, privilege: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Cpu size={18} color="#B00000" /> 2. สเปกทางเทคนิค
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ขนาดจอ (นิ้ว)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="6.7" value={formData.screenSize} onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ประเภทจอ</label>
                      <input type="text" className="form-control shadow-sm" placeholder="AMOLED" value={formData.screenType} onChange={(e) => setFormData({ ...formData, screenType: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>Refresh Rate (Hz)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="120" value={formData.refreshRate} onChange={(e) => setFormData({ ...formData, refreshRate: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชิปเซ็ต/หน่วยประมวลผล (CPU)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น Snapdragon 8 Gen 3 หรือ A17 Pro" value={formData.cpu} onChange={(e) => setFormData({ ...formData, cpu: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหลัง</label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น 50MP + 12MP Ultra-wide" value={formData.rearCam} onChange={(e) => setFormData({ ...formData, rearCam: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหน้า</label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น 12MP" value={formData.frontCam} onChange={(e) => setFormData({ ...formData, frontCam: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ความจุแบตเตอรี่ (mAh)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="5000" value={formData.battery} onChange={(e) => setFormData({ ...formData, battery: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>รองรับชาร์จไว (W)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="45" value={formData.charging} onChange={(e) => setFormData({ ...formData, charging: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ระบบปฏิบัติการ (OS)</label>
                      <input type="text" className="form-control shadow-sm" placeholder="เช่น Android 14" value={formData.os} onChange={(e) => setFormData({ ...formData, os: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>การเชื่อมต่อ / พอร์ต</label>
                      <input type="text" className="form-control shadow-sm" placeholder="5G, Wi-Fi 6, USB-C" value={formData.connectivity} onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                      <Palette size={18} color="#B00000" /> สีและสต็อก <span className="text-danger">*</span>
                    </h5>
                    <button type="button" className="btn btn-sm d-flex align-items-center gap-1 shadow-sm" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '13px', borderRadius: '8px' }} onClick={handleAddColor}>
                      <Plus size={16} /> เพิ่มสี
                    </button>
                  </div>
                  
                  <div 
                    style={{ 
                      maxHeight: '100px', 
                      overflowY: formData.colors.length > 2 ? 'auto' : 'visible',
                      overflowX: 'hidden'
                    }}
                    className={`d-flex flex-column gap-2 ${formData.colors.length > 2 ? 'pe-2' : ''}`}
                  >
                    {formData.colors.map((color, index) => (
                      <div key={index} className="row g-2 align-items-center m-0 w-100">
                        <div className="col-7 col-md-8 px-1">
                          <input type="text" className="form-control shadow-sm" placeholder="ชื่อสี เช่น Titanium Blue" value={color.name} onChange={(e) => handleColorChange(index, "name", e.target.value)} required style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                        </div>
                        <div className="col-4 col-md-3 px-1">
                          <input type="number" className="form-control shadow-sm" placeholder="สต็อก" value={color.stock} onChange={(e) => handleColorChange(index, "stock", e.target.value)} required style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                        </div>
                        <div className="col-1 text-center px-1 d-flex justify-content-center">
                          {formData.colors.length > 1 ? (
                            <button type="button" className="btn btn-link text-danger p-0 m-0" onClick={() => handleRemoveColor(index)}>
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <div style={{ width: '18px', height: '18px' }}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4 */}
                <div className="bg-white p-4 rounded-4 border shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                      <Sparkles size={18} color="#B00000" /> 3. จุดเด่น/ฟีเจอร์พิเศษ
                    </h5>
                    <button type="button" className="btn btn-sm d-flex align-items-center gap-1 shadow-sm" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '13px', borderRadius: '8px' }} onClick={handleAddFeature}>
                      <Plus size={16} /> เพิ่มจุดเด่น
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="row g-2 align-items-center m-0 w-100">
                        <div className="col-11 px-1">
                          <input type="text" className="form-control shadow-sm" placeholder="คำโปรยสั้นๆ เพื่อชูจุดขาย (เช่น กล้องซูม 100 เท่า)" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} style={{ borderRadius: '12px', border: '1px solid #dee2e6' }} />
                        </div>
                        <div className="col-1 text-center px-1 d-flex justify-content-center">
                          {formData.features.length > 1 ? (
                            <button type="button" className="btn btn-link text-danger p-0 m-0 flex-shrink-0" onClick={() => handleRemoveFeature(index)}>
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <div style={{ width: '18px', height: '18px' }}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </form>

              <div className="p-3 border-top bg-white d-flex justify-content-end align-items-center gap-3 rounded-bottom-4">
                <button type="button" className="btn btn-link text-muted text-decoration-none fw-bold" onClick={() => setShowModal(false)} style={{ fontSize: '14px' }}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn text-white fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#B00000', fontSize: '14px', padding: '10px 24px', borderRadius: '12px' }} onClick={handleSubmit}>
                  <Plus size={18} /> บันทึกข้อมูลสินค้า
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}