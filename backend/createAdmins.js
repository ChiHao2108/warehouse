const mysqlPromise = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmins() {
  const connection = await mysqlPromise.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
  });

  const admins = [
    { name: 'Chí Hào', email: 'chihao@gmail.com', password: 'admin123' },
    { name: 'Xuân Trường', email: 'xuantruong@gmail.com', password: 'admin123' }
  ];

  for (const admin of admins) {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [admin.email]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [admin.name, admin.email, hashedPassword, 'admin']
      );
      console.log(`Admin ${admin.name} đã được tạo`);
    } else {
      console.log(`Admin ${admin.name} đã tồn tại, bỏ qua`);
    }
  }

  await connection.end();
}

createAdmins();
