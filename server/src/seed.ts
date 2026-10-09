import connect, { disconnect } from '@/config/db.config';
import { auth } from '@/config/better-auth';
import { Workshop, WORKSHOP_STATUS } from '@/models/workshop.model';
import { Registration, REGISTRATION_STATUS } from '@/models/registration.model';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import { userRepository } from '@/Repositories/user.repository';

const seed = async () => {
  try {
    console.log('🌱 Starting Database Seeding...');
    const connected = await connect();
    if (!connected) throw new Error('Database connection failed');

    // 1. Seed Users (Admin, Manager, Staff)
    const seedUsers = [
      {
        email: 'admin@workshop.com',
        password: 'Password123!',
        name: 'System Admin',
        role: SYSTEM_ROLE.ADMIN,
        phoneNumber: '+15550001'
      },
      {
        email: 'manager@workshop.com',
        password: 'Password123!',
        name: 'Programme Manager (Alice)',
        role: SYSTEM_ROLE.MANAGER,
        phoneNumber: '+15550002'
      },
      {
        email: 'staff@workshop.com',
        password: 'Password123!',
        name: 'Front Desk Staff (Bob)',
        role: SYSTEM_ROLE.STAFF,
        phoneNumber: '+15550003'
      }
    ];

    const createdUsers: Record<string, { id: string; name: string; email: string }> = {};

    for (const u of seedUsers) {
      const existing = await userRepository.findByEmail(u.email);
      if (!existing) {
        console.log(`Creating user: ${u.email} (${u.role})`);
        const result = await auth.api.createUser({
          body: {
            email: u.email,
            password: u.password,
            name: u.name,
            role: u.role as SYSTEM_ROLE,
            data: { phoneNumber: u.phoneNumber }
          }
        });
        createdUsers[u.role] = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email
        };
      } else {
        console.log(`User already exists: ${u.email}`);
        createdUsers[u.role] = {
          id: existing._id.toString(),
          name: existing.name,
          email: existing.email
        };
      }
    }

    const managerActor = createdUsers[SYSTEM_ROLE.MANAGER] || {
      id: 'system',
      name: 'Manager',
      email: 'manager@workshop.com'
    };
    const staffActor = createdUsers[SYSTEM_ROLE.STAFF] || {
      id: 'system',
      name: 'Staff',
      email: 'staff@workshop.com'
    };

    // 2. Clear existing sample workshops & registrations if desired
    await Workshop.deleteMany({});
    await Registration.deleteMany({});
    console.log('Cleared existing workshops and registrations');

    const now = new Date();
    const addDays = (days: number, hour = 10) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      d.setHours(hour, 0, 0, 0);
      return d;
    };

    // 3. Seed Workshops
    const workshopsData = [
      {
        code: 'POT-101',
        title: 'Beginner Pottery Wheel Throwing',
        description: 'Learn fundamental clay preparation, centering, and wheel throwing techniques.',
        category: 'Pottery',
        location: 'Downtown Studio',
        instructor: 'Elena Rostova',
        date: addDays(2, 10),
        capacity: 10,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      },
      {
        code: 'POT-102',
        title: 'Ceramic Glazing & Kiln Firing Masterclass',
        description: 'Explore glazing chemistry, textures, and kiln firing for completed pots.',
        category: 'Pottery',
        location: 'Downtown Studio',
        instructor: 'Elena Rostova',
        date: addDays(4, 14),
        capacity: 6,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      },
      {
        code: 'COD-201',
        title: 'Python for Total Beginners: Automate Tasks',
        description: 'Hands-on practical scripting with Python for spreadsheets and web scraping.',
        category: 'Coding',
        location: 'North Campus',
        instructor: 'Marcus Chen',
        date: addDays(3, 18),
        capacity: 15,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      },
      {
        code: 'COD-202',
        title: 'Build Modern Web Apps with React & Node',
        description: 'Fast-paced weekend crash course building connected full-stack web applications.',
        category: 'Coding',
        location: 'North Campus',
        instructor: 'Sarah Jenkins',
        date: addDays(5, 11),
        capacity: 12,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      },
      {
        code: 'FIT-301',
        title: 'Weekend Flow: Mindful Vinyasa Yoga',
        description: 'Gentle morning flow suitable for all fitness levels to restore mobility.',
        category: 'Fitness',
        location: 'West End Hub',
        instructor: 'Aria Patel',
        date: addDays(1, 9),
        capacity: 8,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      },
      {
        code: 'FIT-302',
        title: 'Functional Mobility & Core Conditioning',
        description: 'Strength training and injury prevention using kettlebells and bodyweight drills.',
        category: 'Fitness',
        location: 'West End Hub',
        instructor: 'Carlos Mendez',
        date: addDays(6, 16),
        capacity: 10,
        activeRegistrationsCount: 0,
        status: WORKSHOP_STATUS.SCHEDULED,
        createdBy: managerActor.id
      }
    ];

    const createdWorkshops = await Workshop.insertMany(workshopsData);
    console.log(`Created ${createdWorkshops.length} workshops across 3 locations.`);

    // 4. Seed sample registrations (Active & Cancelled) to demonstrate history
    const potWorkshop = createdWorkshops[0]; // POT-101
    const codWorkshop = createdWorkshops[2]; // COD-201

    // Seed 3 active registrations for POT-101
    await Registration.create({
      workshopId: potWorkshop._id,
      attendeeName: 'Emma Watson',
      attendeeEmail: 'emma.watson@example.com',
      status: REGISTRATION_STATUS.REGISTERED,
      registeredBy: staffActor,
      registeredAt: new Date(Date.now() - 3600000 * 5),
      notes: 'Front desk phone call - wants seat near front'
    });

    await Registration.create({
      workshopId: potWorkshop._id,
      attendeeName: 'Liam Neeson',
      attendeeEmail: 'liam.n@example.com',
      status: REGISTRATION_STATUS.REGISTERED,
      registeredBy: staffActor,
      registeredAt: new Date(Date.now() - 3600000 * 3),
      notes: 'In-person walk in registration'
    });

    // Seed 1 CANCELLED registration for POT-101 to verify audit trail
    await Registration.create({
      workshopId: potWorkshop._id,
      attendeeName: 'David Tennant',
      attendeeEmail: 'david.t@example.com',
      status: REGISTRATION_STATUS.CANCELLED,
      registeredBy: staffActor,
      registeredAt: new Date(Date.now() - 3600000 * 8),
      cancelledBy: staffActor,
      cancelledAt: new Date(Date.now() - 3600000 * 2),
      cancellationReason: 'Schedule conflict on Saturday morning'
    });

    // Update activeRegistrationsCount for POT-101 to 2
    await Workshop.updateOne({ _id: potWorkshop._id }, { $set: { activeRegistrationsCount: 2 } });

    // Seed 2 registrations for COD-201
    await Registration.create({
      workshopId: codWorkshop._id,
      attendeeName: 'Sophia Loren',
      attendeeEmail: 'sophia@example.com',
      status: REGISTRATION_STATUS.REGISTERED,
      registeredBy: staffActor,
      registeredAt: new Date(Date.now() - 3600000 * 4)
    });

    await Workshop.updateOne({ _id: codWorkshop._id }, { $set: { activeRegistrationsCount: 1 } });

    console.log('✅ Seeding completed successfully!');
    console.log('\n--- Seeded Accounts ---');
    console.log('Admin:   admin@workshop.com   / Password123!');
    console.log('Manager: manager@workshop.com / Password123!');
    console.log('Staff:   staff@workshop.com   / Password123!');
    console.log('-----------------------\n');

    await disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
