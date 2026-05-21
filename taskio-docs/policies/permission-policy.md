---
SOURCE: s3://taskio-ai-docs/policies/permission-policy.md
---

# Chính sách Phân quyền

## Hệ thống phân quyền hoạt động như thế nào?

Taskio sử dụng hai cấp độ phân quyền độc lập:

- **Quyền Workspace**: Kiểm soát những gì bạn có thể làm trong không gian làm việc.
- **Quyền Board**: Kiểm soát những gì bạn có thể làm trong từng board cụ thể.

Mỗi cấp độ có các **vai trò** riêng. Vai trò xác định bạn được phép làm gì.

---

## Vai trò trong Workspace

| Vai trò | Có thể làm gì |
|---------|--------------|
| **Admin** | Xem và chỉnh sửa workspace, mời/xóa/thay đổi vai trò thành viên, tạo và quản lý vai trò tùy chỉnh, tạo board, nâng cấp/hạ cấp gói dịch vụ |
| **Viewer** | Truy cập workspace với quyền hạn chế |

> 💡 Nếu gói dịch vụ cho phép, Admin có thể tạo thêm vai trò tùy chỉnh với các quyền riêng biệt.

---

## Vai trò trong Board

| Vai trò | Có thể làm gì |
|---------|--------------|
| **Admin** | Xem và chỉnh sửa board, quản lý thành viên và vai trò board, tạo/sửa/xóa nhãn, cột, thẻ, bình luận, tệp đính kèm, checklist |
| **Viewer** | Xem board với quyền hạn chế |

> 💡 Tương tự workspace, Admin board có thể tạo vai trò tùy chỉnh nếu gói cho phép.

---

## Cách thay đổi quyền của thành viên

### Trong Workspace
1. Vào **Thành viên** trong workspace.
2. Nhấn vào vai trò hiện tại của thành viên.
3. Chọn vai trò mới.

### Trong Board
1. Vào **Thành viên** trong board.
2. Nhấn vào vai trò hiện tại của thành viên.
3. Chọn vai trò mới.

---

## Điều gì xảy ra nếu bạn không có quyền?

- Các nút hoặc tính năng bạn không có quyền sẽ bị ẩn hoặc vô hiệu hóa.
- Nếu bạn cố thực hiện một hành động không được phép, hệ thống sẽ thông báo lỗi.
- Hãy liên hệ Admin của workspace hoặc board để được cấp thêm quyền.

---

## Lưu ý quan trọng

- Workspace và board luôn phải có ít nhất một Admin.
- Admin cuối cùng không thể bị xóa hoặc thay đổi vai trò.
- Board riêng tư (Private) yêu cầu bạn phải là thành viên board mới xem được.
- Admin cuối cùng của board không thể rời board. Hãy thêm một Admin khác trước khi rời.

---

> 📧 Cần hỗ trợ? Liên hệ: supportTaskio@gmail.com
