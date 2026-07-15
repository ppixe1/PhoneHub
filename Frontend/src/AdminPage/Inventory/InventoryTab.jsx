import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Search, Eye, AlertCircle, Image as ImageIcon, Tag, Cpu, Palette, Sparkles, X, ChevronDown, ListFilter, CheckCircle2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

export default function InventoryTab() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "", name: "", brand: "Apple", ram: "8", rom: "256", price: "", promoPrice: "", privilege: "",
    screenSize: "", screenType: "", refreshRate: "", cpu: "", rearCam: "", frontCam: "", battery: "",
    charging: "", os: "", connectivity: "", colors: [{ name: "", stock: "" }], features: [""], image: ""
  });
  
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  // 2. เพิ่ม useEffect เพื่อดึงข้อมูลจาก Backend ทันทีที่เปิดหน้านี้
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      // จัดการกับข้อมูลที่ได้มา (เผื่อ Backend ส่งมาแล้วมีโครงสร้างแปลกไป)
      const formattedData = data.map(item => ({
        ...item,
        totalStock: item.colors?.reduce((sum, c) => sum + (Number(c.stock) || 0), 0) || item.stock || 0
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("ไม่สามารถดึงข้อมูลสินค้าได้");
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'ทั้งหมด', label: 'สถานะทั้งหมด', icon: <ListFilter size={16} color="#6C757D" /> },
    { value: 'ขายอยู่', label: 'ขายอยู่ (มีสต็อก)', icon: <CheckCircle2 size={16} color="#2E7D32" /> },
    { value: 'สินค้าหมด', label: 'สินค้าหมด (สต็อก 0)', icon: <AlertCircle size={16} color="#DC2626" /> }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.id).includes(searchTerm);
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
      charging: "", os: "", connectivity: "", colors: [{ name: "", stock: "0" }], features: [""], image: ""
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      ...product,
      rom: product.capacity ? product.capacity.replace('GB', '') : "256",
      colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: "", stock: "0" }],
      features: product.features && product.features.length > 0 ? product.features : [""],
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  // 3. อัปเดตฟังก์ชันลบ ให้เรียกไปที่ Backend ก่อน
  const handleDeleteProduct = async (id) => {
    if(window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
      try {
        await deleteProduct(id); // เรียก API ลบข้อมูล
        setProducts(products.filter((p) => p.id !== id)); // ลบออกจากหน้าจอถ้า Backend ลบสำเร็จ
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("เกิดข้อผิดพลาดในการลบสินค้า");
      }
    }
  };

  const handleAddColor = () => setFormData({ ...formData, colors: [...formData.colors, { name: "", stock: "0" }] });
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

  // 4. อัปเดตฟังก์ชันบันทึกข้อมูล ให้ส่งไปที่ Backend (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const totalStock = formData.colors.reduce((sum, c) => sum + (parseInt(c.stock) || 0), 0);
    
    const payload = {
      ...formData,
      capacity: `${formData.rom}GB`,
      totalStock: totalStock,
      // กรณีใช้ Base64 จะส่งไปเก็บดื้อๆ เลย ถ้า Backend รองรับ หรือควรเป็นไฟล์อัปโหลด
      image: formData.image || "https://via.placeholder.com/150" 
    };

    try {
      if (editingId) {
        // แก้ไขข้อมูล (PUT)
        const updatedItem = await updateProduct(editingId, payload);
        // ถ้า API ไม่ได้คืนค่าตัวอัปเดตกลับมา ให้เราอัปเดต state เอง
        const finalItem = updatedItem || { ...payload, id: editingId }; 
        setProducts(products.map((p) => (p.id === editingId ? finalItem : p)));
      } else {
        // เพิ่มข้อมูลใหม่ (POST)
        const newItem = await createProduct(payload);
        setProducts([...products, newItem || { ...payload, id: `NEW-${Date.now()}` }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
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
        {/* 2. แถบส่วนหัวตาราง */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex flex-column flex-sm-row gap-2 w-100" style={{ maxWidth: '560px' }}>
            
            {/* Custom Dropdown สถานะ */}
            <div className="position-relative" style={{ minWidth: '180px' }}>
              <div 
                className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
                style={{ borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', borderColor: isFilterOpen ? '#B00000' : '#e9ecef' }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <div className="d-flex align-items-center gap-2">
                  {statusOptions.find(opt => opt.value === statusFilter)?.icon}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                    {statusOptions.find(opt => opt.value === statusFilter)?.label}
                  </span>
                </div>
                <ChevronDown size={16} style={{ color: '#6c757d', transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
              </div>

              {isFilterOpen && (
                <>
                  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setIsFilterOpen(false)}></div>
                  <div className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" style={{ zIndex: 50, borderRadius: '12px', borderColor: '#e9ecef' }}>
                    {statusOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                        style={{
                          fontSize: '14px', cursor: 'pointer',
                          backgroundColor: statusFilter === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent',
                          color: statusFilter === opt.value ? '#B00000' : '#495057',
                          fontWeight: statusFilter === opt.value ? '600' : '500',
                        }}
                        onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                      >
                        {opt.icon} {opt.label}
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

        {/* 3. ตารางสินค้า */}
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
                {isLoading ? (
                  <tr><td colSpan="9" className="text-center py-5 text-muted">กำลังโหลดข้อมูลสินค้า...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-5 text-muted">ไม่พบข้อมูลสินค้าที่ค้นหา</td></tr>
                ) : (
                  filteredProducts.map((product) => {
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
                          <div className="text-muted" style={{ fontSize: '12px' }}>ความจุ: {product.capacity || '-'} | แบรนด์: {product.brand || '-'}</div>
                        </td>
                        <td className="text-center fw-bold" style={{ color: isOutOfStock ? '#6c757d' : '#B00000', fontSize: '15px' }}>{product.price}</td>
                        <td className="text-center text-muted" style={{ fontSize: '14px' }}><Eye size={14} className="me-1 d-inline" /> {product.views || 0}</td>
                        <td className="text-center fw-bold text-dark" style={{ fontSize: '14px' }}>{product.sold || 0} <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>ชิ้น</span></td>
                        
                        <td className="py-3">
                          <div className="d-flex flex-column mx-auto" style={{ minWidth: '150px', maxWidth: '180px' }}>
                            <div className={`fw-bold mb-2 text-center ${isOutOfStock ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                              รวม: {product.totalStock} เครื่อง
                            </div>
                            <div 
                              style={{ maxHeight: '52px', overflowY: product.colors?.length > 2 ? 'auto' : 'visible', overflowX: 'hidden' }}
                              className="custom-scrollbar"
                            >
                              {product.colors?.map((c, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '13px' }}>
                                  <span className="text-muted text-truncate me-2" style={{ maxWidth: '110px' }}>- {c.name || 'ไม่ระบุสี'}</span>
                                  <span className={`fw-bold flex-shrink-0 ${c.stock > 0 ? 'text-success' : 'text-danger'}`}>{c.stock}</span>
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
                              padding: '6px 12px', fontSize: '12px', fontWeight: '600'
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Modal เพิ่ม/แก้ไขสินค้า */}
        {showModal && (
          <div
            className="position-fixed"
            style={{ top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}
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
                    </span>
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

                {/* Section 1: ข้อมูลพื้นฐาน */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Tag size={18} color="#B00000" /> 1. ข้อมูลพื้นฐาน
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชื่อรุ่นและยี่ห้อ <span className="text-danger">*</span></label>
                      <input type="text" className="form-control shadow-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>แบรนด์ <span className="text-danger">*</span></label>
                      <select className="form-select shadow-sm" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ borderRadius: '12px', cursor: 'pointer' }}>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>RAM (GB)</label>
                      <input type="number" className="form-control shadow-sm" value={formData.ram} onChange={(e) => setFormData({ ...formData, ram: e.target.value })} style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ROM (GB)</label>
                      <select className="form-select shadow-sm" value={formData.rom} onChange={(e) => setFormData({ ...formData, rom: e.target.value })} style={{ borderRadius: '12px', cursor: 'pointer' }}>
                        <option value="128">128</option><option value="256">256</option><option value="512">512</option><option value="1024">1TB</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ราคาเต็ม (บาท) <span className="text-danger">*</span></label>
                      <input type="number" className="form-control shadow-sm" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ราคาโปรโมชั่น (ถ้ามี)</label>
                      <input type="number" className="form-control shadow-sm" value={formData.promoPrice} onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })} style={{ borderRadius: '12px' }} />
                    </div>
                  </div>
                </div>

                {/* Section 2: สเปกทางเทคนิค (ย่อส่วนนิดหน่อยเพื่อความกระชับ) */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Cpu size={18} color="#B00000" /> 2. สเปกทางเทคนิค
                  </h5>
                  <div className="row g-3">
                    <div className="col-12"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชิปเซ็ต/หน่วยประมวลผล (CPU)</label><input type="text" className="form-control shadow-sm" value={formData.cpu} onChange={(e) => setFormData({ ...formData, cpu: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหลัง</label><input type="text" className="form-control shadow-sm" value={formData.rearCam} onChange={(e) => setFormData({ ...formData, rearCam: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหน้า</label><input type="text" className="form-control shadow-sm" value={formData.frontCam} onChange={(e) => setFormData({ ...formData, frontCam: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ความจุแบตเตอรี่ (mAh)</label><input type="text" className="form-control shadow-sm" value={formData.battery} onChange={(e) => setFormData({ ...formData, battery: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ระบบปฏิบัติการ (OS)</label><input type="text" className="form-control shadow-sm" value={formData.os} onChange={(e) => setFormData({ ...formData, os: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                  </div>
                </div>

                {/* Section 3: สีและสต็อก */}
                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}><Palette size={18} color="#B00000" /> สีและสต็อก <span className="text-danger">*</span></h5>
                    <button type="button" className="btn btn-sm d-flex align-items-center gap-1 shadow-sm" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '13px', borderRadius: '8px' }} onClick={handleAddColor}><Plus size={16} /> เพิ่มสี</button>
                  </div>
                  <div className={`d-flex flex-column gap-2 ${formData.colors.length > 2 ? 'pe-2' : ''}`}>
                    {formData.colors.map((color, index) => (
                      <div key={index} className="row g-2 align-items-center m-0 w-100">
                        <div className="col-7 col-md-8 px-1"><input type="text" className="form-control shadow-sm" placeholder="ชื่อสี" value={color.name} onChange={(e) => handleColorChange(index, "name", e.target.value)} required style={{ borderRadius: '12px' }} /></div>
                        <div className="col-4 col-md-3 px-1"><input type="number" className="form-control shadow-sm" placeholder="สต็อก" value={color.stock} onChange={(e) => handleColorChange(index, "stock", e.target.value)} required style={{ borderRadius: '12px' }} /></div>
                        <div className="col-1 text-center px-1 d-flex justify-content-center">
                          {formData.colors.length > 1 && <button type="button" className="btn btn-link text-danger p-0 m-0" onClick={() => handleRemoveColor(index)}><Trash2 size={18} /></button>}
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
                <button type="submit" className="btn text-white fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#B00000', fontSize: '14px', padding: '10px 24px', borderRadius: '12px' }} onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "กำลังบันทึก..." : <><Plus size={18} /> บันทึกข้อมูลสินค้า</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}