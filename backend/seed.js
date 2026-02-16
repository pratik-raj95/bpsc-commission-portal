require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Task = require('./models/Task');
const Document = require('./models/Document');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Announcement.deleteMany({});
    await Task.deleteMany({});
    await Document.deleteMany({});

    console.log('Existing data cleared');

    // Create demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.create([
      {
        username: 'superadmin',
        email: 'superadmin@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'Chief Secretary',
        role: 'superadmin',
        department: 'Administration',
        designation: 'Chief Secretary',
        employeeId: 'BPSC001',
        phone: '9876543210',
        isActive: true
      },
      {
        username: 'admin',
        email: 'admin@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'Admin Officer',
        role: 'admin',
        department: 'Administration',
        designation: 'Admin Officer',
        employeeId: 'BPSC002',
        phone: '9876543211',
        isActive: true
      },
      {
        username: 'employee1',
        email: 'employee1@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'John Sharma',
        role: 'employee',
        department: 'Finance',
        designation: 'Senior Accountant',
        employeeId: 'BPSC101',
        phone: '9876543212',
        isActive: true
      },
      {
        username: 'employee2',
        email: 'employee2@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'Priya Gupta',
        role: 'employee',
        department: 'HR',
        designation: 'HR Manager',
        employeeId: 'BPSC102',
        phone: '9876543213',
        isActive: true
      },
      {
        username: 'employee3',
        email: 'employee3@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'Rajesh Kumar',
        role: 'employee',
        department: 'IT',
        designation: 'System Administrator',
        employeeId: 'BPSC103',
        phone: '9876543214',
        isActive: true
      },
      {
        username: 'user1',
        email: 'user@bpsc.gov.in',
        password: hashedPassword,
        fullName: 'Citizen User',
        role: 'user',
        department: 'Public',
        designation: 'Citizen',
        phone: '9876543215',
        isActive: true
      }
    ]);

    console.log('Users created');

    // Create announcements
    const announcements = await Announcement.create([
      {
        title: 'BPSC Recruitment 2024 - Apply Online',
        content: 'The Bihar Public Service Commission invites applications for various posts. Eligible candidates can apply through the official portal before the last date. Detailed information regarding eligibility, exam pattern, and important dates is available in the notification.',
        category: 'recruitment',
        priority: 'urgent',
        status: 'published',
        publishDate: new Date(),
        isFeatured: true,
        order: 1,
        createdBy: users[0]._id
      },
      {
        title: 'Examination Schedule for Combined Competitive Exam',
        content: 'The preliminary examination for the Combined Competitive Exam 2024 will be held on 15th February 2024. Admit cards will be available for download from 1st February 2024. Candidates are advised to check the official website regularly for updates.',
        category: 'notice',
        priority: 'important',
        status: 'published',
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isFeatured: true,
        order: 2,
        createdBy: users[0]._id
      },
      {
        title: 'Result Declaration - Interview Schedule',
        content: 'The result of the written examination for various posts has been declared. Qualified candidates are required to appear for interview. The interview schedule will be uploaded soon. For any query, contact the commission office.',
        category: 'result',
        priority: 'important',
        status: 'published',
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isFeatured: true,
        order: 3,
        createdBy: users[1]._id
      },
      {
        title: 'Office Holiday List 2024',
        content: 'The list of holidays for the year 2024 has been published. The commission will remain closed on all public holidays as per the government notification.',
        category: 'circular',
        priority: 'normal',
        status: 'published',
        publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isFeatured: false,
        createdBy: users[1]._id
      },
      {
        title: 'New Online Portal Launch',
        content: 'We are pleased to announce the launch of our new online portal for better service delivery. Citizens can now apply for various services online through this portal.',
        category: 'news',
        priority: 'normal',
        status: 'published',
        publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        isFeatured: false,
        createdBy: users[0]._id
      },
      {
        title: 'Annual Report 2023 Released',
        content: 'The Annual Report of BPSC for the year 2023 has been released. The report highlights the achievements and initiatives taken by the commission during the year.',
        category: 'news',
        priority: 'normal',
        status: 'published',
        publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        isFeatured: false,
        createdBy: users[0]._id
      }
    ]);

    console.log('Announcements created');

    // Create tasks
    const tasks = await Task.create([
      {
        title: 'Prepare Quarterly Financial Report',
        description: 'Prepare and submit the quarterly financial report for Q4 2023. Include all expenditures and revenue details.',
        assignedTo: users[2]._id,
        assignedBy: users[1]._id,
        department: 'Finance',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Update Employee Database',
        description: 'Update the employee database with recent promotions and new joinings.',
        assignedTo: users[3]._id,
        assignedBy: users[1]._id,
        department: 'HR',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Server Maintenance',
        description: 'Perform routine server maintenance and security updates.',
        assignedTo: users[4]._id,
        assignedBy: users[1]._id,
        department: 'IT',
        status: 'pending',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Prepare Budget Proposal',
        description: 'Prepare the budget proposal for the financial year 2024-2025.',
        assignedTo: users[2]._id,
        assignedBy: users[0]._id,
        department: 'Finance',
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Conduct Training Session',
        description: 'Organize and conduct a training session for new employees about office procedures.',
        assignedTo: users[3]._id,
        assignedBy: users[0]._id,
        department: 'HR',
        status: 'review',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Tasks created');

    console.log('Seed data created successfully!');
    console.log('\nDemo Accounts:');
    console.log('Super Admin: superadmin@bpsc.gov.in / password123');
    console.log('Admin: admin@bpsc.gov.in / password123');
    console.log('Employee: employee1@bpsc.gov.in / password123');
    console.log('Employee: employee2@bpsc.gov.in / password123');
    console.log('Employee: employee3@bpsc.gov.in / password123');
    console.log('User: user@bpsc.gov.in / password123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
