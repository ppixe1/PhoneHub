import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ควบคุม Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  
  // ควบคุม Confirm Modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(''); // 'save' | 'delete'
  const [userToDelete, setUserToDelete] = useState(null);

  // ฟอร์มข้อมูลผู้ใช้
  const initialFormState = {
    id: '',
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postal_code: ''
  };
  const [formData, setFormData] = useState(initialFormState);


  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await axios.get('http://localhost:3000/auth/'); // ปรับ URL ให้ตรงกับ API ของคุณ
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setFetchError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. ดึงข้อมูลผู้ใช้ตอนโหลดหน้าจอ
  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. จัดการ Input ภายในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. ฟังก์ชันเปิด Modal สำหรับ "เพิ่มผู้ใช้"
  const handleAddClick = () => {
    setModalMode('add');
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // 4. ฟังก์ชันเปิด Modal สำหรับ "แก้ไขผู้ใช้"
  const handleEditClick = (user) => {
    setModalMode('edit');
    // เคลียร์รหัสผ่านทุกครั้งที่เปิดแก้ เพื่อความปลอดภัย (เว้นแต่ต้องการเปลี่ยน)
    setFormData({ ...user, password: '' }); 
    setIsModalOpen(true);
  };

  // 5. ฟังก์ชันเปิด Modal ยืนยันการ "ลบ"
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setConfirmAction('delete');
    setShowConfirm(true);
  };

  // 6. ฟังก์ชันส่งข้อมูล (เพิ่ม/แก้ไข) ไปให้ Confirm Modal
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setConfirmAction('save');
    setShowConfirm(true);
  };

  // 7. ฟังก์ชันดำเนินการจริง (ยิง API) หลังจากกด "ยืนยัน"
  const executeConfirmAction = async () => {
    setShowConfirm(false);
    setIsProcessing(true);

    try {
      if (confirmAction === 'save') {
        if (modalMode === 'add') {
          const newUser = await axios.post('http://localhost:3000/auth/register', formData);
          // setUsers([newUser.data, ...users]);
          toast.success('เพิ่มผู้ใช้สำเร็จ');
        } else {
          const updatedUser = await axios.put(`http://localhost:3000/auth/${formData.id}`, formData);
          // setUsers(users.map(u => u.id === formData.id ? updatedUser.data.data : u));
          toast.success('อัปเดตข้อมูลผู้ใช้สำเร็จ');
        }
        setIsModalOpen(false);
        fetchUsers();
      } else if (confirmAction === 'delete' && userToDelete) {
        await axios.delete(`http://localhost:3000/auth/${userToDelete.id}`);
        // setUsers(users.filter(u => u.id !== userToDelete.id));
        toast.success('ลบผู้ใช้สำเร็จ');
        setUserToDelete(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
    } finally {
      setIsProcessing(false);
    }
  };

  // ระบบค้นหา
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Header Section */}
      <div className="rounded-4 overflow-hidden shadow-sm border mb-4" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>
            จัดการผู้ใช้ (User Management)
          </h2>
          <p className="m-0 text-white-50" style={{ paddingLeft: '24px' }}>
            เพิ่ม ลบ แก้ไข และจัดการข้อมูลผู้ใช้งานในระบบ
          </p>
        </div>
      </div>

      <div className="px-1">
        {/* Toolbar Section */}
        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4 w-100">
          <div className="input-group shadow-sm" style={{ maxWidth: '350px', borderRadius: '8px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white border-end-0" style={{ paddingLeft: '16px' }}>
              <i className="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              placeholder="ค้นหา Username, ชื่อ, อีเมล, เบอร์โทร..." 
              className="form-control border-start-0 ps-2 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 0', fontSize: '14px' }}
            />
          </div>

          <button 
            onClick={handleAddClick}
            className="btn shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: '#FFD129', color: '#000', fontWeight: '700', borderRadius: '8px', padding: '10px 20px' }}
          >
            <i className="bi bi-person-plus-fill"></i> เพิ่มผู้ใช้ใหม่
          </button>
        </div>

        {fetchError && <div className="alert alert-danger shadow-sm mb-4">{fetchError}</div>}

        {/* Table Section */}
        <div className="bg-white rounded-4 shadow-sm border overflow-hidden" style={{ borderColor: '#e9ecef' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0" style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: '#B00000', color: 'white', fontSize: '14px' }}>
                  <th className="text-center py-3 px-4" style={{ width: '8%' }}>ID</th>
                  <th className="py-3" style={{ width: '15%' }}>Username</th>
                  <th className="py-3" style={{ width: '20%' }}>ชื่อ-นามสกุล</th>
                  <th className="py-3" style={{ width: '20%' }}>อีเมล</th>
                  <th className="text-center py-3" style={{ width: '12%' }}>เบอร์โทร</th>
                  <th className="text-center py-3" style={{ width: '25%' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center text-muted p-5">กำลังโหลดข้อมูลผู้ใช้...</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td className="text-center text-muted" style={{ fontSize: '14px' }}>{user.id}</td>
                      <td className="fw-bold" style={{ fontSize: '14px', color: '#B00000' }}>{user.username}</td>
                      <td className="fw-medium text-dark" style={{ fontSize: '14px' }}>{user.name}</td>
                      <td className="text-muted" style={{ fontSize: '14px' }}>{user.email || '-'}</td>
                      <td className="text-center text-muted" style={{ fontSize: '14px' }}>{user.phone || '-'}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="btn btn-sm shadow-sm d-inline-flex justify-content-center align-items-center gap-1"
                            style={{ backgroundColor: '#f8f9fa', color: '#495057', fontSize: '13px', fontWeight: '600', border: '1px solid #dee2e6', borderRadius: '6px', padding: '6px 12px' }}
                          >
                            <i className="bi bi-pencil-square"></i> แก้ไข
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(user)}
                            className="btn btn-sm shadow-sm d-inline-flex justify-content-center align-items-center gap-1"
                            style={{ backgroundColor: '#FFF0F0', color: '#DC3545', fontSize: '13px', fontWeight: '600', border: '1px solid #FFD0D0', borderRadius: '6px', padding: '6px 12px' }}
                          >
                            <i className="bi bi-trash"></i> ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted p-5" style={{ fontSize: '14px' }}>
                      ไม่พบข้อมูลผู้ใช้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }} onClick={() => setIsModalOpen(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-light rounded-4 shadow-lg d-flex flex-column overflow-hidden" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh' }}>
              
              <div className="text-white p-4 d-flex justify-content-between align-items-start" style={{ backgroundColor: '#B00000' }}>
                <div>
                  <h3 className="fw-bold m-0 mb-1" style={{ fontSize: '18px' }}>
                    {modalMode === 'add' ? 'เพิ่มผู้ใช้งานใหม่' : 'แก้ไขข้อมูลผู้ใช้'}
                  </h3>
                  <p className="m-0" style={{ fontSize: '12px', color: 'rgba(255, 209, 41, 0.8)' }}>
                    {modalMode === 'edit' && `กำลังแก้ไขข้อมูล ID: ${formData.id}`}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="btn-close btn-close-white"></button>
              </div>

              <div className="overflow-auto p-4" style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
                <form id="userForm" onSubmit={handleSubmitForm} className="bg-white p-4 rounded-4 border shadow-sm" style={{ borderColor: '#e9ecef' }}>
                  
                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: '15px' }}>ข้อมูลบัญชี</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>Username *</label>
                      <input type="text" className="form-control shadow-none" name="username" value={formData.username} onChange={handleInputChange} required style={{ fontSize: '14px' }} disabled={modalMode === 'edit'} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>Password {modalMode === 'edit' && '(ปล่อยว่างหากไม่เปลี่ยน)'}</label>
                      <input type="password" className="form-control shadow-none" name="password" value={formData.password} onChange={handleInputChange} required={modalMode === 'add'} style={{ fontSize: '14px' }} placeholder={modalMode === 'edit' ? '********' : ''} />
                    </div>
                  </div>

                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: '15px' }}>ข้อมูลส่วนตัว</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>ชื่อ-นามสกุล *</label>
                      <input type="text" className="form-control shadow-none" name="name" value={formData.name} onChange={handleInputChange} required style={{ fontSize: '14px' }} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>อีเมล</label>
                      <input type="email" className="form-control shadow-none" name="email" value={formData.email} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>เบอร์โทรศัพท์</label>
                      <input type="text" className="form-control shadow-none" name="phone" value={formData.phone} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                  </div>

                  <h5 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: '15px' }}>ข้อมูลที่อยู่</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>ที่อยู่รายละเอียด (บ้านเลขที่, หมู่, ซอย, ถนน)</label>
                      <textarea className="form-control shadow-none" name="address" rows="2" value={formData.address} onChange={handleInputChange} style={{ fontSize: '14px' }}></textarea>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>แขวง/ตำบล</label>
                      <input type="text" className="form-control shadow-none" name="subdistrict" value={formData.subdistrict} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>เขต/อำเภอ</label>
                      <input type="text" className="form-control shadow-none" name="district" value={formData.district} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>จังหวัด</label>
                      <input type="text" className="form-control shadow-none" name="province" value={formData.province} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label text-muted fw-bold" style={{ fontSize: '13px' }}>รหัสไปรษณีย์</label>
                      <input type="text" className="form-control shadow-none" name="postal_code" value={formData.postal_code} onChange={handleInputChange} style={{ fontSize: '14px' }} />
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-3 border-top bg-white d-flex justify-content-end align-items-center gap-3 rounded-bottom-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted text-decoration-none fw-bold" style={{ fontSize: '14px' }}>ยกเลิก</button>
                <button type="submit" form="userForm" className="btn shadow-sm text-dark" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '14px', borderRadius: '8px', padding: '10px 24px' }}>
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการกระทำ (บันทึก / ลบ) */}
      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1060 }} onClick={() => setShowConfirm(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-4 shadow-lg p-5 text-center" style={{ width: '100%', maxWidth: '400px' }}>
              
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" 
                style={{ width: '56px', height: '56px', backgroundColor: confirmAction === 'delete' ? '#F8D7DA' : '#fff3cd', color: confirmAction === 'delete' ? '#DC3545' : '#ff9800' }}>
                {confirmAction === 'delete' ? (
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '28px' }}></i>
                ) : (
                  <i className="bi bi-question-circle" style={{ fontSize: '28px' }}></i>
                )}
              </div>
              
              <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>
                {confirmAction === 'delete' ? 'ยืนยันการลบผู้ใช้?' : 'ยืนยันการบันทึกข้อมูล?'}
              </h4>
              
              <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                {confirmAction === 'delete' 
                  ? `คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "${userToDelete?.username}" การกระทำนี้ไม่สามารถย้อนกลับได้`
                  : 'คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลผู้ใช้นี้ ใช่หรือไม่?'}
              </p>
              
              <div className="d-flex gap-3 justify-content-center mt-2">
                <button onClick={() => setShowConfirm(false)} className="btn btn-light fw-bold shadow-sm" style={{ fontSize: '14px', padding: '10px 24px', borderRadius: '8px' }}>ยกเลิก</button>
                <button onClick={executeConfirmAction} className="btn text-white shadow-sm" disabled={isProcessing}
                  style={{ backgroundColor: confirmAction === 'delete' ? '#DC3545' : '#B00000', fontSize: '14px', fontWeight: 'bold', padding: '10px 24px', borderRadius: '8px' }}>
                  {isProcessing ? 'กำลังดำเนินการ...' : (confirmAction === 'delete' ? 'ยืนยันลบ' : 'ยืนยันบันทึก')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}