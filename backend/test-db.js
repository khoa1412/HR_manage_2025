const { PrismaClient } = require('./generated/prisma');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Kiểm tra kết nối và đếm số bảng
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('✅ Kết nối database thành công!');
    console.log(`📊 Số bảng đã tạo: ${tables.length}`);
    console.log('📋 Danh sách bảng:');
    tables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table.table_name}`);
    });
    
    // Kiểm tra bảng employees
    const employeeCount = await prisma.employees.count();
    console.log(`👥 Số nhân viên trong database: ${employeeCount}`);
    
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

