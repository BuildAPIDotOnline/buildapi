import { config } from 'dotenv';
config({ path: '.env.local' });

import { getDb } from '../lib/mongodb';
import { hashPassword } from '../lib/password';
import { ObjectId } from 'mongodb';

async function seedPricingPlans() {
  const db = await getDb();
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small projects and testing',
      price: 49, // ₦49.00 in NGN
      features: [
        '10,000 API calls/month',
        'Basic support',
        'Standard SLA',
        'Email support',
      ],
      apiCallLimit: 10000,
      status: 'active' as const,
      popular: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Professional',
      description: 'For growing businesses and production apps',
      price: 199, // ₦199.00 in NGN
      features: [
        '100,000 API calls/month',
        'Priority support',
        '99.9% SLA',
        '24/7 email support',
        'Advanced analytics',
      ],
      apiCallLimit: 100000,
      status: 'active' as const,
      popular: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Enterprise',
      description: 'For large-scale applications and teams',
      price: 499, // ₦499.00 in NGN
      features: [
        'Unlimited API calls',
        'Dedicated support',
        '99.99% SLA',
        'Phone & email support',
        'Custom integrations',
        'Dedicated account manager',
      ],
      apiCallLimit: -1, // -1 means unlimited
      status: 'active' as const,
      popular: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const collection = db.collection('pricingplans');
  
  // Check if plans already exist
  const existingPlans = await collection.countDocuments();
  if (existingPlans > 0) {
    console.log('Pricing plans already exist, skipping seed...');
    return;
  }

  await collection.insertMany(plans);
  console.log('✅ Seeded pricing plans');
}

async function seedIndustries() {
  const db = await getDb();
  const industries = [
    {
      name: 'Banking',
      slug: 'banking',
      description: 'Banking & Finance',
      active: true,
      order: 1,
      createdAt: new Date(),
    },
    {
      name: 'CRM',
      slug: 'crm',
      description: 'CRM & Sales',
      active: true,
      order: 2,
      createdAt: new Date(),
    },
    {
      name: 'E-commerce',
      slug: 'ecommerce',
      description: 'E-commerce platforms',
      active: true,
      order: 3,
      createdAt: new Date(),
    },
    {
      name: 'CMS',
      slug: 'cms',
      description: 'CMS & Content Management',
      active: true,
      order: 4,
      createdAt: new Date(),
    },
  ];

  const collection = db.collection('industries');
  
  // Check if industries already exist
  const existingIndustries = await collection.countDocuments();
  if (existingIndustries > 0) {
    console.log('Industries already exist, skipping seed...');
    return;
  }

  await collection.insertMany(industries);
  console.log('✅ Seeded industries');
}

async function seedUsers() {
  const db = await getDb();
  const usersCollection = db.collection('users');
  
  // Check if users already exist
  const existingUsers = await usersCollection.countDocuments();
  if (existingUsers > 0) {
    console.log('Users already exist, skipping seed...');
    return;
  }

  // Hash passwords for test users
  const passwordHash = await hashPassword('password123'); // All test users will have this password

  const users = [
    {
      email: 'john.doe@example.com',
      password: passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1 (555) 123-4567',
      country: 'United States',
      companyName: 'TechCorp Inc.',
      jobTitle: 'Senior Developer',
      companySize: '51-200',
      industry: 'Banking & Finance',
      heardAboutUs: 'Search Engine',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'jane.smith@example.com',
      password: passwordHash,
      firstName: 'Jane',
      lastName: 'Smith',
      phoneNumber: '+44 20 7946 0958',
      country: 'United Kingdom',
      companyName: 'Finance Solutions Ltd',
      jobTitle: 'CTO',
      companySize: '201-500',
      industry: 'Banking & Finance',
      heardAboutUs: 'Direct Referral',
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'alex.rivera@example.com',
      password: passwordHash,
      firstName: 'Alex',
      lastName: 'Rivera',
      phoneNumber: '+1 (555) 987-6543',
      country: 'United States',
      companyName: 'E-commerce Pro',
      jobTitle: 'Full Stack Developer',
      companySize: '11-50',
      industry: 'Ecommerce',
      heardAboutUs: 'Developer Community',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await usersCollection.insertMany(users);
  console.log('✅ Seeded test users');
  console.log('   Test credentials:');
  console.log('   - Email: john.doe@example.com | Password: password123');
  console.log('   - Email: jane.smith@example.com | Password: password123');
  console.log('   - Email: alex.rivera@example.com | Password: password123');
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    await seedPricingPlans();
    await seedIndustries();
    await seedUsers();
    console.log('✅ Database seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

