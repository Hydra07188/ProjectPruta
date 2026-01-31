import React, { useState } from 'react';
import './Complaint.css';
import { 
  Home, MessageCircle, Lightbulb, Wifi, Droplet, 
  Search, Filter, Eye, Edit, Trash2, ChevronLeft,
  Check, X // ✅ เพิ่มไอคอน Check (บันทึก) และ X (ยกเลิก)
} from 'lucide-react';
import './Sidebar.css'; 

const Complaint = ({ onBack }: { onBack: () => void }) => {
  
  // ข้อมูลหลัก (Main State)
  const [complaints, setComplaints] = useState([
    { id: 'C-2024-001', date: '2024-01-15 09:30', category: 'ไฟถนน', location: 'ซอยสุขุมวิท 21 หมู่ 3', status: 'pending', statusLabel: 'รอดำเนินการ' },
    { id: 'C-2024-002', date: '2024-01-14 14:15', category: 'WiFi', location: 'ตลาดสดพลูตาหลวง', status: 'progress', statusLabel: 'กำลังดำเนินการ' },
    // ... (ข้อมูลอื่นๆ)
    { id: 'C-2024-008', date: '2024-01-10 13:00', category: 'WiFi', location: 'ศูนย์บริการประชาชน', status: 'done', statusLabel: 'เสร็จสิ้น' },
  ]);

  // --- 🆕 State สำหรับระบบแก้ไข ---
  // เก็บ ID ของแถวที่กำลังแก้ไข (ถ้าไม่มีให้เป็น null)
  const [editingId, setEditingId] = useState<string | null>(null);
  // เก็บข้อมูลชั่วคราวที่กำลังพิมพ์แก้ไข
  const [editFormData, setEditFormData] = useState<any>({});


  // --- 🆕 ฟังก์ชันต่างๆ ---

  // 1. เริ่มแก้ไข: เมื่อกดปุ่มดินสอ
  const handleStartEdit = (item: any) => {
    setEditingId(item.id); // บอกระบบว่า "ฉันจะแก้แถวเช็คบิลนี้นะ"
    setEditFormData(item); // ดึงข้อมูลเดิมมาใส่ในฟอร์มชั่วคราว
  };

  // 2. ยกเลิกแก้ไข: เมื่อกดปุ่ม X
  const handleCancelEdit = () => {
    setEditingId(null); // เลิกจำ ID
    setEditFormData({}); // ล้างข้อมูลชั่วคราว
  };

  // 3. จับการพิมพ์: เมื่อพิมพ์ในช่อง Input
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // 4. บันทึก: เมื่อกดปุ่ม Check
  const handleSaveEdit = (id: string) => {
    // อัปเดต Label ของสถานะให้ตรงกับค่า status ที่เลือกใหม่
    let newStatusLabel = editFormData.statusLabel;
    if (editFormData.status === 'pending') newStatusLabel = 'รอดำเนินการ';
    else if (editFormData.status === 'progress') newStatusLabel = 'กำลังดำเนินการ';
    else if (editFormData.status === 'done') newStatusLabel = 'เสร็จสิ้น';
    
    const finalData = { ...editFormData, statusLabel: newStatusLabel };

    // วนลูปอัปเดตข้อมูลใน State หลัก
    const updatedList = complaints.map((item) => 
      item.id === id ? { ...item, ...finalData } : item
    );

    setComplaints(updatedList); // บันทึกข้อมูลใหม่
    setEditingId(null); // ปิดโหมดแก้ไข
  };

  // ฟังก์ชันลบ (เดิม)
  const handleDelete = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      setComplaints(complaints.filter(item => item.id !== id));
    }
  };

  const getIcon = (category: string) => {
    // ... (ฟังก์ชันเดิม)
    if (category === 'ไฟถนน') return <Lightbulb size={16} className="text-yellow-500" />;
    if (category === 'WiFi') return <Wifi size={16} className="text-blue-500" />;
    if (category === 'ประปาหัวแดง') return <Droplet size={16} className="text-red-500" />;
    return <MessageCircle size={16} />;
  };

  // --- ส่วนแสดงผล (Render) ---
  return (
    <div className="complaint-container">
      <aside className="shared-sidebar">
         {/* ... (Sidebar เหมือนเดิม) ... */}
         <div className="left-header">
          <div className="logo-box"><Home size={24} color="white" /></div>
          <div><h3>เทศบาลตำบล</h3><p>พลูตาหลวง</p></div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={onBack} style={{ cursor: 'pointer' }}><Home size={20} /><span>ภาพรวม</span></div>
          <div className="nav-item active" style={{ cursor: 'pointer' }}><MessageCircle size={20} /><span>ระบบร้องเรียน</span></div>
          {/* ... เมนูอื่นๆ ... */}
        </nav>
      </aside>

      <main className="main-body">
        <header className="page-header">
          <h1>ระบบร้องเรียน</h1>
          <p>จัดการเรื่องร้องเรียนจากประชาชน</p>
        </header>

        {/* ... (Filter Bar เหมือนเดิม) ... */}
        <div className="filter-bar">
          {/* ... */}
          <div className="total-count">พบ {complaints.length} รายการ</div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>วันที่/เวลา</th>
                <th>ประเภท</th>
                <th>สถานที่</th>
                <th>รูปภาพ</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((item) => (
                // 🆕 เช็คว่าแถวนี้กำลังถูกแก้ไขอยู่หรือไม่?
                <tr key={item.id} className={editingId === item.id ? 'editing-row' : ''}>
                  
                  {/* ID (แก้ไขไม่ได้) */}
                  <td className="col-id">{item.id}</td>

                  {/* วันที่/เวลา (แก้ไขได้) */}
                  <td>
                    {editingId === item.id ? (
                      <input 
                        type="text" name="date" className="edit-input"
                        value={editFormData.date} onChange={handleEditFormChange}
                      />
                    ) : (
                      <span className="col-date">{item.date}</span>
                    )}
                  </td>

                  {/* ประเภท (แก้ไขได้ - ใช้ Dropdown) */}
                  <td>
                    {editingId === item.id ? (
                       <select name="category" className="edit-select" value={editFormData.category} onChange={handleEditFormChange}>
                         <option value="ไฟถนน">ไฟถนน</option>
                         <option value="WiFi">WiFi</option>
                         <option value="ประปาหัวแดง">ประปาหัวแดง</option>
                       </select>
                    ) : (
                      <div className="category-tag">
                        {getIcon(item.category)}<span>{item.category}</span>
                      </div>
                    )}
                  </td>

                  {/* สถานที่ (แก้ไขได้) */}
                  <td>
                    {editingId === item.id ? (
                      <input 
                        type="text" name="location" className="edit-input"
                        value={editFormData.location} onChange={handleEditFormChange} style={{width: '100%'}}
                      />
                    ) : item.location}
                  </td>

                  {/* รูปภาพ (ยังไม่ให้แก้ไข) */}
                  <td><div className="img-placeholder"><div className="img-icon"></div></div></td>

                  {/* สถานะ (แก้ไขได้ - ใช้ Dropdown) */}
                  <td>
                    {editingId === item.id ? (
                      <select name="status" className="edit-select" value={editFormData.status} onChange={handleEditFormChange}>
                        <option value="pending">รอดำเนินการ</option>
                        <option value="progress">กำลังดำเนินการ</option>
                        <option value="done">เสร็จสิ้น</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${item.status}`}>
                        <span className="dot"></span> {item.statusLabel}
                      </span>
                    )}
                  </td>

                  {/* ปุ่มจัดการ (เปลี่ยนตามสถานะ) */}
                  <td>
                    <div className="action-buttons">
                      {editingId === item.id ? (
                        // ✅ ถ้ากำลังแก้ไข โชว์ปุ่ม Save / Cancel
                        <>
                          <button className="btn-icon save" onClick={() => handleSaveEdit(item.id)} title="บันทึก">
                            <Check size={18} color="green" />
                          </button>
                          <button className="btn-icon cancel" onClick={handleCancelEdit} title="ยกเลิก">
                            <X size={18} color="red" />
                          </button>
                        </>
                      ) : (
                        // 👁️ ถ้าปกติ โชว์ปุ่ม ดู / แก้ไข / ลบ
                        <>
                          <button className="btn-icon"><Eye size={16} /></button>
                          <button className="btn-icon" onClick={() => handleStartEdit(item)} title="แก้ไข">
                            <Edit size={16} />
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(item.id)} title="ลบ">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* ... (ส่วนแสดงเมื่อไม่มีข้อมูล) ... */}
        </div>
      </main>
    </div>
  );
};

export default Complaint;