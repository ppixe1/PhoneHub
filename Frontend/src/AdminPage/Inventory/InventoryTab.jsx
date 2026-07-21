import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Search, Eye, AlertCircle, Image as ImageIcon, Tag, Cpu, Palette, X, ChevronDown, ListFilter, CheckCircle2 } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { toast } from 'sonner';

export default function InventoryTab() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "", name: "", brand: "Apple", ram: "", promoPrice: "", privilege: "",
    screenSize: "", screenType: "", refreshRate: "", cpu: "", backCam: "", frontCam: "", battery: "",
    charging: "", os: "", connectivity: "", 
    variations: [{ storage: "256GB", color: "", stock: "0", price: "" }], // ปรับโครงสร้างให้รับข้อมูลครบ 4 ค่า
    image: ""
  });
  
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      
      const formattedData = data.map(item => {
        const parseJSON = (val, fallback) => {
          if (!val) return fallback;
          if (typeof val === 'string') {
            try { return JSON.parse(val); } catch (e) { return fallback; }
          }
          return val;
        };

        const dbVariations = parseJSON(item.variation, []);
        const images = parseJSON(item.img, []);
        const specs = parseJSON(item.specifications, {});

        // จัดการดึงข้อมูล Variation จาก Database ให้ตรงกับ Form UI
        const mappedVariations = dbVariations.length > 0 
          ? dbVariations.map(v => ({
              storage: v.storage || "",
              color: v.color || "",
              stock: String(v.stock || "0"),
              price: String(v.price || "")
            })) 
          : [{ storage: "256GB", color: "", stock: "0", price: "" }];

        const totalStock = mappedVariations.reduce((sum, v) => sum + Number(v.stock), 0);
        const defaultPrice = mappedVariations[0]?.price || "0";
        const baseCapacity = mappedVariations[0]?.storage || "-";

        return {
          id: item.id,
          name: item.model,
          brand: item.brand,
          ram: specs.ram || "", 
          capacity: baseCapacity,
          price: defaultPrice,
          promoPrice: specs.promoPrice || "",
          privilege: specs.highlights || "",
          screenSize: specs.screenSize || "",
          screenType: specs.screenType || "",
          refreshRate: specs.refreshRate || "",
          cpu: specs.chipset || "",
          backCam: specs.backCamera || "",
          frontCam: specs.frontCamera || "",
          battery: specs.batteryLife || "",
          charging: specs.fastCharge || "",
          os: specs.os || "",
          connectivity: specs.connections || "",
          variations: mappedVariations, // ใช้ข้อมูล mappedVariations
          image: images[0] || item.img,
          totalStock,
          views: item.views || 0,
          sold: item.sold || 0,
        };
      });
      
      setProducts(formattedData);
    } catch (error) {
      if (error) {
        console.error("Error fetching products:", error);
        toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'ทั้งหมด', icon: <ListFilter size={16} color="#6C757D" /> },
    { value: 'in-stock', label: 'ขายอยู่', icon: <CheckCircle2 size={16} color="#2E7D32" /> },
    { value: 'out-of-stock', label: 'สินค้าหมด', icon: <AlertCircle size={16} color="#DC2626" /> }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.id).includes(searchTerm);
    const isOutOfStock = p.totalStock <= 0;
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "in-stock" && !isOutOfStock) ||
      (statusFilter === "out-of-stock" && isOutOfStock);
      
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    setFormData({
      id: "", name: "", brand: "Apple", ram: "", promoPrice: "", privilege: "",
      screenSize: "", screenType: "", refreshRate: "", cpu: "", backCam: "", frontCam: "", battery: "",
      charging: "", os: "", connectivity: "", 
      variations: [{ storage: "256GB", color: "", stock: "0", price: "" }], 
      image: ""
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setFormData({
      ...product,
      variations: product.variations && product.variations.length > 0 ? product.variations : [{ storage: "256GB", color: "", stock: "0", price: "" }],
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("เกิดข้อผิดพลาดในการลบสินค้า");
      }
    }
  };

  const handleAddVariation = () => {
    setFormData({ 
      ...formData, 
      variations: [...formData.variations, { storage: "256GB", color: "", stock: "0", price: "" }] 
    });
  };

  const handleRemoveVariation = (index) => {
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    setFormData({ ...formData, variations: newVariations });
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData({ ...formData, variations: newVariations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();

    formPayload.append("brand", formData.brand);
    formPayload.append("model", formData.name);

    formPayload.append('variation', JSON.stringify(
      formData.variations.map(v => ({
        storage: v.storage,
        color: v.color,
        stock: String(v.stock || "0"),
        price: String(v.price || "0")
      }))
    ))


    formPayload.append("img", formData.image || "https://img.magnific.com/premium-vector/nothing-rubber-stamp-seal-vector_140916-33167.jpg?semt=ais_hybrid&w=740&q=80");


    formPayload.append("specifications", JSON.stringify({
      screenSize: formData.screenSize,
      screenType: formData.screenType,
      refreshRate: formData.refreshRate,
      chipset: formData.cpu,
      backCamera: formData.backCam,
      frontCamera: formData.frontCam,
      batteryLife: formData.battery,
      fastCharge: formData.charging,
      os: formData.os,
      connections: formData.connectivity,
      highlights: formData.privilege,
      // ram: formData.ram,
      // promoPrice: formData.promoPrice
    }));
    
    console.log(Object.fromEntries(formPayload))

    try {
      if (editingId) {
        await updateProduct(editingId, formPayload);
      } else {
        await createProduct(formPayload);
      }
      
      await fetchInventory();
      setShowModal(false);
    } catch (error) {
      if (error) {
        console.error("Error saving product:", error);
        toast.error("เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้");
      }
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
      
      <div className="rounded-4 overflow-hidden shadow-sm border mb-4" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>
            จัดการคลังสินค้า (Inventory)
          </h2>
          <p className="m-0 text-white-50" style={{ paddingLeft: '24px' }}>จัดการสินค้าและสต็อก เชื่อมต่อ Database สมบูรณ์</p>
        </div>
      </div>

      <div className="px-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="d-flex flex-column flex-sm-row gap-2 w-100" style={{ maxWidth: '560px' }}>
            
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

        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0" style={{ minWidth: '1050px' }}>
              <thead>
                <tr style={{ backgroundColor: '#B00000', color: 'white', fontSize: '14px' }}>
                  <th className="py-3 px-4" style={{ width: '8%' }}>รหัส</th>
                  <th className="py-3" style={{ width: '10%' }}>รูปภาพ</th>
                  <th className="py-3" style={{ width: '20%' }}>ชื่อสินค้า</th>
                  <th className="py-3 text-center" style={{ width: '12%' }}>ราคาเริ่มต้น (บาท)</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>ยอดเข้าดู</th>
                  <th className="py-3 text-center" style={{ width: '10%' }}>ขายแล้ว</th>
                  <th className="py-3" style={{ width: '16%' }}>สต็อก (ความจุ/สี)</th>
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
                          <div className="text-muted" style={{ fontSize: '12px' }}>แบรนด์: {product.brand || '-'}</div>
                        </td>
                        <td className="text-center fw-bold" style={{ color: isOutOfStock ? '#6c757d' : '#B00000', fontSize: '15px' }}>
                          {product.price ? Number(product.price).toLocaleString() : '0'}
                        </td>
                        <td className="text-center text-muted" style={{ fontSize: '14px' }}><Eye size={14} className="me-1 d-inline" /> {product.views || 0}</td>
                        <td className="text-center fw-bold text-dark" style={{ fontSize: '14px' }}>{product.sold || 0} <span className="text-muted fw-normal" style={{ fontSize: '13px' }}>ชิ้น</span></td>
                        
                        <td className="py-3">
                          <div className="d-flex flex-column mx-auto" style={{ minWidth: '180px', maxWidth: '220px' }}>
                            <div className={`fw-bold mb-2 text-center ${isOutOfStock ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                              รวม: {product.totalStock} เครื่อง
                            </div>
                            <div 
                              style={{ maxHeight: '60px', overflowY: product.variations?.length > 2 ? 'auto' : 'visible', overflowX: 'hidden' }}
                              className="custom-scrollbar"
                            >
                              {product.variations?.map((v, idx) => (
                                <div key={idx} className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '12px' }}>
                                  <span className="text-muted text-truncate me-2" style={{ maxWidth: '140px' }}>- {v.storage} {v.color || 'ไม่ระบุสี'}</span>
                                  <span className={`fw-bold flex-shrink-0 ${v.stock > 0 ? 'text-success' : 'text-danger'}`}>{v.stock}</span>
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

        {showModal && (
          <div
            className="position-fixed"
            style={{ top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-light rounded-4 shadow-lg d-flex flex-column overflow-hidden"
              style={{ width: "95%", maxWidth: "800px", maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#B00000', color: 'white' }}>
                <h4 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: '18px' }}>
                  <Plus size={20} /> {editingId ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่เข้าคลัง"}
                </h4>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-auto p-4" style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
                
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
                        <button type="button" className="d-flex align-items-center justify-content-center btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1" style={{ width: '24px', height: '24px' }} onClick={() => setFormData({...formData, image: ''})}>
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Tag size={18} color="#B00000" /> 1. ข้อมูลพื้นฐาน
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชื่อรุ่น <span className="text-danger">*</span></label>
                      <input type="text" className="form-control shadow-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>แบรนด์ <span className="text-danger">*</span></label>
                      <select className="form-select shadow-sm" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ borderRadius: '12px', cursor: 'pointer' }}>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Vivo">Vivo</option>
                        <option value="Oppo">Oppo</option>
                        <option value="Xiaomi">Xiaomi</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>RAM</label>
                      <input type="text" placeholder="เช่น 8GB" className="form-control shadow-sm" value={formData.ram} onChange={(e) => setFormData({ ...formData, ram: e.target.value })} style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ราคาโปรโมชั่น (ถ้ามี)</label>
                      <input type="number" className="form-control shadow-sm" value={formData.promoPrice} onChange={(e) => setFormData({ ...formData, promoPrice: e.target.value })} style={{ borderRadius: '12px' }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>จุดเด่น (Highlights)</label>
                      <textarea className="form-control shadow-sm" rows="2" value={formData.privilege} onChange={(e) => setFormData({ ...formData, privilege: e.target.value })} style={{ borderRadius: '12px' }}></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}>
                    <Cpu size={18} color="#B00000" /> 2. สเปกทางเทคนิค
                  </h5>
                  <div className="row g-3">
                    <div className="col-12"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชิปเซ็ต/หน่วยประมวลผล (Chipset)</label><input type="text" className="form-control shadow-sm" value={formData.cpu} onChange={(e) => setFormData({ ...formData, cpu: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    
                    <div className="col-md-4"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ขนาดหน้าจอ</label><input type="text" className="form-control shadow-sm" value={formData.screenSize} onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-4"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ชนิดหน้าจอ</label><input type="text" className="form-control shadow-sm" value={formData.screenType} onChange={(e) => setFormData({ ...formData, screenType: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-4"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>Refresh Rate</label><input type="text" className="form-control shadow-sm" value={formData.refreshRate} onChange={(e) => setFormData({ ...formData, refreshRate: e.target.value })} style={{ borderRadius: '12px' }} /></div>

                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหลัง</label><input type="text" className="form-control shadow-sm" value={formData.backCam} onChange={(e) => setFormData({ ...formData, backCam: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>กล้องหน้า</label><input type="text" className="form-control shadow-sm" value={formData.frontCam} onChange={(e) => setFormData({ ...formData, frontCam: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>การใช้งานแบตเตอรี่</label><input type="text" className="form-control shadow-sm" value={formData.battery} onChange={(e) => setFormData({ ...formData, battery: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ระบบชาร์จไว</label><input type="text" className="form-control shadow-sm" value={formData.charging} onChange={(e) => setFormData({ ...formData, charging: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>ระบบปฏิบัติการ (OS)</label><input type="text" className="form-control shadow-sm" value={formData.os} onChange={(e) => setFormData({ ...formData, os: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold text-dark" style={{ fontSize: '13px' }}>การเชื่อมต่อไร้สาย</label><input type="text" className="form-control shadow-sm" value={formData.connectivity} onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })} style={{ borderRadius: '12px' }} /></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '16px' }}><Palette size={18} color="#B00000" /> 3. รุ่นย่อย (ความจุ, สี, ราคา, สต็อก) <span className="text-danger">*</span></h5>
                    <button type="button" className="btn btn-sm d-flex align-items-center gap-1 shadow-sm" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '13px', borderRadius: '8px' }} onClick={handleAddVariation}><Plus size={16} /> เพิ่มรุ่นย่อย</button>
                  </div>
                  <div className={`d-flex flex-column gap-2 ${formData.variations.length > 2 ? 'pe-2' : ''}`}>
                    {formData.variations.map((v, index) => (
                      <div key={index} className="row g-2 align-items-center m-0 w-100 mb-2">
                        <div className="col-6 col-md-3 px-1">
                          <input type="text" className="form-control shadow-sm" placeholder="ความจุ (เช่น 256GB)" value={v.storage} onChange={(e) => handleVariationChange(index, "storage", e.target.value)} required style={{ borderRadius: '12px', fontSize: '13px' }} />
                        </div>
                        <div className="col-6 col-md-3 px-1">
                          <input type="text" className="form-control shadow-sm" placeholder="สี (เช่น Cosmic Orange)" value={v.color} onChange={(e) => handleVariationChange(index, "color", e.target.value)} required style={{ borderRadius: '12px', fontSize: '13px' }} />
                        </div>
                        <div className="col-5 col-md-3 px-1">
                          <input type="number" className="form-control shadow-sm" placeholder="ราคา (บาท)" value={v.price} onChange={(e) => handleVariationChange(index, "price", e.target.value)} required style={{ borderRadius: '12px', fontSize: '13px' }} />
                        </div>
                        <div className="col-5 col-md-2 px-1">
                          <input type="number" className="form-control shadow-sm" placeholder="สต็อก" value={v.stock} onChange={(e) => handleVariationChange(index, "stock", e.target.value)} required style={{ borderRadius: '12px', fontSize: '13px' }} />
                        </div>
                        <div className="col-2 col-md-1 text-center px-1 d-flex justify-content-center">
                          {formData.variations.length > 1 && (
                            <button type="button" className="btn btn-link text-danger p-0 m-0" onClick={() => handleRemoveVariation(index)}>
                              <Trash2 size={18} />
                            </button>
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