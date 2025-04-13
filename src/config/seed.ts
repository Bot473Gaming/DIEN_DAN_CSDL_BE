import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if admin already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@ptit.edu.vn',
      fullname: 'Administrator',
      role: UserRole.ADMIN,
    });

    await userRepository.save(adminUser);
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}
