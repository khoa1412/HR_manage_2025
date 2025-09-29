import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatNumber } from './payrollService'

// Configure jsPDF for Vietnamese text
const configureFont = (doc) => {
  // Add Vietnamese font support (fallback to Arial)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
}

export const generatePayslipPDF = (salaryData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  configureFont(doc)

  // Company header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('CONG TY CO PHAN ABC', 105, 20, { align: 'center' })
  
  doc.setFontSize(14)
  doc.text(`PHIEU LUONG THANG ${salaryData.period}`, 105, 30, { align: 'center' })

  // Employee information
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const empInfo = [
    ['Ho va ten:', salaryData.employee.fullName],
    ['Ma nhan vien:', salaryData.employee.code],
    ['Phong ban:', salaryData.employee.department],
    ['Chuc vu:', salaryData.employee.position],
    ['Luong co ban:', formatCurrency(salaryData.employee.basicSalary)]
  ]

  let yPos = 45
  empInfo.forEach(([label, value]) => {
    doc.text(label, 20, yPos)
    doc.text(value, 80, yPos)
    yPos += 7
  })

  // Salary details table
  const tableData = [
    ['Khoan muc', 'So luong', 'Don gia', 'Thanh tien'],
    [
      'Ngay cong thuc te',
      `${salaryData.attendance.actualWorkDays}/${salaryData.attendance.workingDays}`,
      formatNumber(salaryData.salaryComponents.dailyRate),
      formatCurrency(salaryData.salaryComponents.basePay)
    ],
    [
      'Gio tang ca',
      `${salaryData.attendance.overtimeHours}h`,
      formatNumber(salaryData.salaryComponents.overtimeRate),
      formatCurrency(salaryData.salaryComponents.overtimePay)
    ],
    [
      'Phu cap chuc vu',
      '1',
      formatCurrency(salaryData.salaryComponents.positionAllowance),
      formatCurrency(salaryData.salaryComponents.positionAllowance)
    ],
    [
      'Phu cap di lai',
      '1',
      formatCurrency(salaryData.salaryComponents.transportAllowance),
      formatCurrency(salaryData.salaryComponents.transportAllowance)
    ],
    [
      'Phu cap an trua',
      `${salaryData.attendance.actualWorkDays} ngay`,
      '50,000',
      formatCurrency(salaryData.salaryComponents.mealAllowance)
    ]
  ]

  // Add custom benefits to the table
  if (salaryData.salaryComponents.customBenefitsDetails && salaryData.salaryComponents.customBenefitsDetails.length > 0) {
    salaryData.salaryComponents.customBenefitsDetails.forEach(benefit => {
      tableData.push([
        benefit.name,
        '1',
        formatCurrency(benefit.amount),
        formatCurrency(benefit.monthlyEquivalent)
      ])
    })
  }

  doc.autoTable({
    head: [tableData[0]],
    body: tableData.slice(1),
    startY: yPos + 10,
    theme: 'striped',
    headStyles: { fillColor: [79, 129, 189] },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Total income row
  doc.autoTable({
    body: [['TONG THU NHAP', '', '', formatCurrency(salaryData.grossSalary)]],
    startY: doc.lastAutoTable.finalY,
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold', fillColor: [220, 220, 220] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Deductions
  const deductionData = [
    ['BHXH (8.0%)', 'Khau tru', '', formatCurrency(salaryData.deductions.socialInsurance)],
    ['BHYT (1.5%)', 'Khau tru', '', formatCurrency(salaryData.deductions.healthInsurance)],
    ['BHTN (1.0%)', 'Khau tru', '', formatCurrency(salaryData.deductions.unemploymentInsurance)],
    ['Thue TNCN', 'Khau tru', '', formatCurrency(salaryData.deductions.personalIncomeTax)]
  ]

  doc.autoTable({
    body: deductionData,
    startY: doc.lastAutoTable.finalY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40 },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Total deductions
  doc.autoTable({
    body: [['TONG KHAU TRU', '', '', formatCurrency(salaryData.deductions.total)]],
    startY: doc.lastAutoTable.finalY,
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold', fillColor: [255, 200, 200] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Net salary
  doc.autoTable({
    body: [['LUONG THUC NHAN', '', '', formatCurrency(salaryData.netSalary)]],
    startY: doc.lastAutoTable.finalY,
    theme: 'plain',
    styles: { fontSize: 12, fontStyle: 'bold', fillColor: [200, 255, 200] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Signatures
  const signY = doc.lastAutoTable.finalY + 20
  doc.setFontSize(10)
  doc.text('Nguoi lap', 30, signY)
  doc.text('Phong Nhan su', 105, signY)
  doc.text('Nguoi nhan', 165, signY)

  doc.text('(Ky, ho ten)', 25, signY + 25)
  doc.text('(Ky, ho ten)', 100, signY + 25)
  doc.text('(Ky, ho ten)', 160, signY + 25)

  // Footer
  doc.setFontSize(8)
  doc.text(`Phieu luong duoc tao tu dong vao ${new Date().toLocaleDateString('vi-VN')}`, 105, 280, { align: 'center' })
  doc.text('Hotline: 1900-xxx-xxx | Email: hr@company.com', 105, 285, { align: 'center' })

  return doc
}

export const generateBulkPayslipsPDF = (payrollData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  payrollData.employees.forEach((employee, index) => {
    if (index > 0) {
      doc.addPage()
    }
    
    // Generate individual payslip for each employee
    const singleDoc = generatePayslipPDF(employee)
    
    // Copy content to main document
    const pages = singleDoc.internal.pages
    if (pages && pages.length > 1) {
      const pageContent = pages[1]
      if (pageContent) {
        doc.internal.pages[doc.internal.pages.length - 1] = pageContent
      }
    }
  })

  return doc
}

export const generatePayrollSummaryPDF = (payrollData) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  configureFont(doc)

  // Header
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('BANG LUONG TONG HOP', 148, 20, { align: 'center' })
  doc.text(`Thang ${payrollData.period}`, 148, 30, { align: 'center' })

  // Summary statistics
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const summaryData = [
    ['Tong nhan vien:', payrollData.summary.totalEmployees],
    ['Tong chi luong:', formatCurrency(payrollData.summary.totalNetSalary)],
    ['Tong khau tru:', formatCurrency(payrollData.summary.totalDeductions)],
    ['Luong trung binh:', formatCurrency(payrollData.summary.avgNetSalary)]
  ]

  let yPos = 45
  summaryData.forEach(([label, value]) => {
    doc.text(label, 20, yPos)
    doc.text(String(value), 80, yPos)
    yPos += 7
  })

  // Employee salary table
  const tableData = payrollData.employees.map(emp => [
    emp.employee.fullName,
    emp.employee.code,
    emp.employee.department,
    `${emp.attendance.actualWorkDays}/${emp.attendance.workingDays}`,
    `${emp.attendance.overtimeHours}h`,
    formatNumber(emp.grossSalary),
    formatNumber(emp.deductions.total),
    formatNumber(emp.netSalary)
  ])

  doc.autoTable({
    head: [['Ho ten', 'Ma NV', 'Phong ban', 'Ngay cong', 'Tang ca', 'Thu nhap', 'Khau tru', 'Thuc nhan']],
    body: tableData,
    startY: yPos + 10,
    theme: 'striped',
    headStyles: { fillColor: [79, 129, 189] },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 30, halign: 'right' },
      7: { cellWidth: 30, halign: 'right' }
    }
  })

  // Total row
  const totalRow = [
    'TONG CONG',
    '',
    '',
    '',
    '',
    formatNumber(payrollData.summary.totalGrossSalary || payrollData.employees.reduce((sum, emp) => sum + emp.grossSalary, 0)),
    formatNumber(payrollData.summary.totalDeductions),
    formatNumber(payrollData.summary.totalNetSalary)
  ]

  doc.autoTable({
    body: [totalRow],
    startY: doc.lastAutoTable.finalY,
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold', fillColor: [220, 220, 220] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 15 },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 30, halign: 'right' },
      7: { cellWidth: 30, halign: 'right' }
    }
  })

  return doc
}

export const downloadPDF = (doc, filename) => {
  doc.save(filename)
}

export const printPDF = (doc) => {
  const pdfUrl = doc.output('bloburl')
  const printWindow = window.open(pdfUrl, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
