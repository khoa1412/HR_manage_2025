import { useState, useEffect } from 'react'
import { 
  Bell,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  User
} from 'lucide-react'
import { listAnnouncements, upsertAnnouncement, deleteAnnouncement } from '../services/api'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const announcementsData = listAnnouncements()
      setAnnouncements(announcementsData)
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      const announcementData = {
        title: formData.get('title'),
        content: formData.get('content'),
        author: formData.get('author') || 'Admin'
      }

      if (editingAnnouncement) {
        announcementData.id = editingAnnouncement.id
      }

      upsertAnnouncement(announcementData)
      setShowForm(false)
      setEditingAnnouncement(null)
      loadData()
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert('Có lỗi xảy ra khi lưu thông báo')
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      try {
        await deleteAnnouncement(id)
        loadData()
      } catch (error) {
        console.error('Error deleting announcement:', error)
        alert('Có lỗi xảy ra khi xóa thông báo')
      }
    }
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông báo và tin tức công ty
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingAnnouncement(null)
            setShowForm(true)
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo thông báo</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{announcement.author || 'Admin'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(announcement.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm.' : 'Chưa có thông báo nào được tạo.'}
          </p>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingAnnouncement ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingAnnouncement?.title || ''}
                  className="input"
                  placeholder="Nhập tiêu đề thông báo..."
                  required
                />
              </div>
              
              <div>
                <label className="label">Nội dung</label>
                <textarea
                  name="content"
                  defaultValue={editingAnnouncement?.content || ''}
                  className="input"
                  rows="8"
                  placeholder="Nhập nội dung thông báo..."
                  required
                />
              </div>
              
              <div>
                <label className="label">Tác giả</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingAnnouncement?.author || 'Admin'}
                  className="input"
                  placeholder="Tên tác giả..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAnnouncement(null)
                  }}
                  className="btn-outline"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingAnnouncement ? 'Cập nhật' : 'Tạo thông báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
