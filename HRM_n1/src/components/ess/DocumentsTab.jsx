import { Upload, Eye, Download, FileText } from 'lucide-react'

export default function DocumentsTab({ employeeFiles }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tài liệu cá nhân</h3>
        <button className="btn-primary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Tải lên tài liệu</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeFiles.map((doc) => (
          <div key={doc.id} className="card p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{doc.name}</h4>
                <p className="text-sm text-gray-500">{doc.size} • {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button className="btn-outline flex-1 flex items-center justify-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Xem</span>
              </button>
              <button className="btn-outline flex-1 flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Tải</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
