# 📢 Thông báo

## 📋 Tổng Quan Module

Module Thông báo cung cấp hệ thống communication nội bộ, cho phép HR và management gửi announcements, notifications và updates đến employees một cách hiệu quả.

## 🎯 Mục Đích Sử Dụng

- **👨‍💼 Management**: Broadcast important company updates
- **👩‍💼 HR Team**: Employee communications, policy updates
- **📢 Communications**: Company news, events, announcements
- **👤 Employees**: Receive và acknowledge notifications

## 🧭 Cách Truy Cập

1. **Từ sidebar**: Click vào icon 📢 "Thông báo"
2. **URL trực tiếp**: `http://localhost:3001/announcements`

## 📱 Giao Diện & Tính Năng

### ➕ **Create Announcement**
```
┌─────────────────────────────────────────────────────┐
│ [📝 Tạo thông báo mới]                             │
├─────────────────────────────────────────────────────┤
│ 📝 Tiêu đề: [______________________________]       │
│ 👥 Đối tượng: [ All Employees ▼ ]                  │ 
│ 🏷️ Loại: [ Company News ▼ ]                        │
│ ⚡ Ưu tiên: [ Normal ▼ ]                           │
│ 📅 Publish: [ Now ▼ ] 📅 Expire: [Optional]        │
│ ┌─ 📝 Nội dung ─────────────────────────────────┐   │
│ │ [Rich text editor với formatting options]    │   │
│ │                                               │   │
│ └───────────────────────────────────────────────┘   │
│ [🚀 Publish] [💾 Save Draft] [👁️ Preview]          │
└─────────────────────────────────────────────────────┘
```

### 📋 **Announcements List**
- **Priority Indicators**: High/Medium/Low priority với colors
- **Status Badges**: Published/Draft/Expired status
- **Target Audience**: Show target employees/departments
- **Engagement Metrics**: Views, acknowledgments, reactions
- **Quick Actions**: Edit, Duplicate, Archive, Delete

### 🎯 **Targeting Options**
- **All Employees**: Broadcast to entire company
- **Department-specific**: Target specific departments
- **Role-based**: Target by job positions/levels
- **Custom Groups**: Create custom employee groups
- **Individual**: Send to specific individuals

### 📊 **Analytics Dashboard**
- **Reach Metrics**: Total views, unique views
- **Engagement**: Acknowledgment rates, time spent reading
- **Delivery Status**: Delivered, read, acknowledged
- **Performance**: Most effective announcement types

## 🎨 Content Features

### ✍️ **Rich Text Editor**
- **Formatting**: Bold, italic, underline, colors
- **Lists**: Bulleted and numbered lists
- **Links**: Hyperlinks to internal/external resources
- **Images**: Upload và embed images
- **Tables**: Create structured data tables

### 📎 **Attachments**
- **File Upload**: PDF, DOC, images support
- **Document Library**: Link to company document repository
- **Forms**: Embed forms cho feedback/responses
- **Links**: Quick links to relevant resources

### 🔔 **Notification Settings**
- **Delivery Methods**: Email, in-app, mobile push
- **Scheduling**: Immediate, scheduled, recurring
- **Reminders**: Auto-reminders cho unread announcements
- **Acknowledgment**: Require employee acknowledgment

---

**📝 Next**: [📚 Tổng quan hệ thống](./system-overview.md)  
**🔙 Back**: [💰 Cài đặt Lương](./payroll-settings.md)
