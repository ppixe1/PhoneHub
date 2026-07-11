# 📱 PhoneHub (โฟนฮับ)
### แพลตฟอร์ม E-Commerce สำหรับจำหน่ายสมาร์ทโฟน
<!-- > **รายวิชา:** CSI204 ดิจิทัลแพลตฟอร์มสำหรับพัฒนาซอฟต์แวร์ (ภาคฤดูร้อน/2568)   -->
<!-- > **ภาควิชา:** Department of Computer Science and Software Development Innovation -->

---

## 👥 สมาชิกกลุ่ม

| ลำดับ | รหัสนักศึกษา | ชื่อ-สกุล | หน้าที่รับผิดชอบ |
| :---: | :---: | :--- | :--- |
| 1 | 67163280 | คณิศร์ จำจด | PM, Backend Developer |
| 2 | 67163975 | ภูบดินทร์ เรืองวิลัย | Frontend Developer, Tester |
| 3 | 67142294 | นิชกานต์ คำสุข | Frontend Developer |
| 4 | 67167379 | ชนาวีร์ ใยโพธิ์ทอง | UX/UI Designer |

---

## 💡 หลักการและเหตุผล (Rationale)
ในยุคปัจจุบัน โทรศัพท์มือถือและอุปกรณ์ไอทีไม่ได้เป็นเพียงแค่เครื่องมือสื่อสาร แต่เป็นปัจจัยสำคัญในการดำรงชีวิต การทำงาน และการทำธุรกรรมต่าง ๆ ส่งผลให้ตลาดมีการเติบโตและเปลี่ยนแปลงอย่างรวดเร็ว อย่างไรก็ตาม การบริหารจัดการร้านค้าหรือระบบจำหน่ายโทรศัพท์มือถือในปัจจุบันยังคงประสบปัญหาสำคัญหลายประการ ทีมพัฒนาจึงได้เล็งเห็นถึงโอกาสในการสร้างแพลตฟอร์มดิจิทัลที่มีประสิทธิภาพเพื่อตอบโจทย์ทั้งผู้ซื้อและผู้ขาย

## 🎯 วัตถุประสงค์ (Objectives)
1. เพื่อศึกษา วิเคราะห์ และออกแบบระบบบริหารจัดการการจำหน่ายโทรศัพท์มือถือที่เหมาะสมกับผู้ใช้งาน
2. เพื่อศึกษาและพัฒนาเว็บไซต์ E-Commerce สำหรับจำหน่ายสมาร์ทโฟนรุ่นยอดนิยมที่ใช้งานง่าย
3. เพื่อศึกษาและประยุกต์ใช้ Tools ต่าง ๆ ในการพัฒนาเว็บไซต์ให้เกิดประสิทธิภาพสูงสุด

---

## 🔍 การวิเคราะห์และออกแบบระบบ (Analysis & Design)

### 👥 ผู้ใช้งานในระบบ (Actors)
* **ลูกค้า (Customer):** เข้าใช้งานระบบเพื่อเลือกซื้อสินค้า
* **ผู้ดูแลระบบ (Administrator):** จัดการข้อมูลสินค้า สต็อกสินค้า และดูแลระบบโดยรวม
* **ผู้จัดการ (Manager):** ดูรายงาน สรุปยอดขาย และภาพรวมของแพลตฟอร์ม

### ⚙️ ความสามารถหลักของระบบ (Main Functions)
1. **ระบบจัดอันดับมือถือยอดนิยม:** แสดงผลสมาร์ทโฟนรุ่นที่ได้รับความสนใจสูง
2. **ระบบซื้อสินค้า:** เลือกสินค้าลงตะกร้า ชำระเงิน และจัดการคำสั่งซื้อ
3. **ระบบติดตามสถานะคำสั่งซื้อ:** ตรวจสอบขั้นตอนการจัดส่งสินค้าได้แบบเรียลไทม์
4. **ระบบการจัดการสินค้า:** เพิ่ม ลบ แก้ไข ข้อมูลสมาร์ทโฟน สเปค และราคา
5. **ระบบจัดการผู้ใช้งาน:** ระบบสมัครสมาชิก เข้าสู่ระบบ และการจัดการสิทธิ์

---

## 🛠️ เทคโนโลยีและเครื่องมือที่ใช้ (Tools & Technologies)

* **Frontend:** React, Bootstrap, JavaScript
* **Backend:** Node.js
* **Database:** MySQL
* **Design Tools:** Figma, Draw.io
* **Version Control:** Git, GitHub
* **Testing Tools:** Postman, Manual Testing

---

## 📊 แผนผังโครงสร้างระบบ (System Architecture)
สถาปัตยกรรมของเว็บแอปพลิเคชันแบ่งออกเป็น 3 ส่วนหลัก (3-Tier Architecture) ตามแผนภาพด้านล่างนี้:

```mermaid
graph TD
    %% Clients
    subgraph Client_Side [Frontend Web Application]
        A[React / Bootstrap App]
    end

    %% Web Server / API
    subgraph Server_Side [Backend API Server]
        B[Node.js / Express Server]
        C[API Routing & Controller]
    end

    %% Database
    subgraph Database_Side [Data Storage]
        D[(MySQL Database)]
    end

    %% Connections
    A <-->|HTTP Requests / Axios| B
    B --> C
    C <-->|SQL Queries| D

    %% Styling
    style A fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style B fill:#68A063,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#00758F,stroke:#333,stroke-width:2px,color:#fff