import connect, { disconnect } from '@/config/db.config';
import { IUser } from '@/models/auth.models';
import { SYSTEM_ROLE } from '@/constants/user.constants';
import { Workshop, WORKSHOP_STATUS } from '@/models/workshop.model';
import { Registration } from '@/models/registration.model';
import { registrationService } from '@/services/registration.service';

/**
 * Concurrency Verification Test:
 * Simulates 30 front desk staff trying to register 30 different attendees
 * at the exact same millisecond for a workshop that only has 5 seats left.
 *
 * Expected outcome:
 * - Exactly 5 registrations succeed (status 201)
 * - Exactly 25 registrations fail with ConflictException (Capacity Full)
 * - activeRegistrationsCount in Workshop document is exactly equal to capacity (5)
 * - Zero overbooking.
 */
const runConcurrencyTest = async () => {
  try {
    console.log('⚡ Starting Concurrency Race Condition Test...');
    await connect();

    // 1. Create a test workshop with capacity = 5
    const testCode = `CONCUR-${Date.now().toString().slice(-4)}`;
    const workshop = await Workshop.create({
      code: testCode,
      title: 'High Demand Pottery Workshop',
      category: 'Pottery',
      location: 'Downtown Studio',
      instructor: 'Elena Rostova',
      date: new Date(Date.now() + 86400000 * 2),
      capacity: 5,
      activeRegistrationsCount: 0,
      status: WORKSHOP_STATUS.SCHEDULED,
      createdBy: 'concurrency-tester'
    });

    console.log(`Created test workshop ${testCode} with capacity: 5`);

    // 2. Prepare 30 concurrent registration attempts
    const concurrentRequestsCount = 30;
    const dummyStaff: IUser = {
      id: 'staff-test-id',
      name: 'Concurrent Staff Tester',
      email: 'staff.tester@workshop.com',
      phoneNumber: '+15550003',
      banned: false,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: SYSTEM_ROLE.STAFF
    };

    console.log(`Firing ${concurrentRequestsCount} simultaneous registration requests...`);

    const promises = Array.from({ length: concurrentRequestsCount }).map((_, index) => {
      const attendeeName = `Attendee #${index + 1}`;
      const attendeeEmail = `attendee${index + 1}_${Date.now()}@example.com`;

      return registrationService
        .registerAttendee(
          {
            workshopId: workshop._id.toString(),
            attendeeName,
            attendeeEmail,
            notes: `Simultaneous test attempt #${index + 1}`
          },
          dummyStaff
        )
        .then(() => ({ success: true, index }))
        .catch((err) => ({ success: false, error: err.message, index }));
    });

    const results = await Promise.all(promises);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`\n--- Concurrency Test Results ---`);
    console.log(`Total Requests Sent: ${concurrentRequestsCount}`);
    console.log(`Successful Registrations: ${successful.length} (Expected: 5)`);
    console.log(`Rejected (Capacity Full): ${failed.length} (Expected: 25)`);

    // 3. Verify database state
    const verifiedWorkshop = await Workshop.findById(workshop._id);
    const activeRegistrationsInDb = await Registration.countDocuments({
      workshopId: workshop._id,
      status: 'REGISTERED'
    });

    console.log(`Workshop capacity: ${verifiedWorkshop?.capacity}`);
    console.log(`activeRegistrationsCount in Workshop document: ${verifiedWorkshop?.activeRegistrationsCount}`);
    console.log(`Actual Registration documents in MongoDB: ${activeRegistrationsInDb}`);

    if (
      successful.length === 5 &&
      failed.length === 25 &&
      verifiedWorkshop?.activeRegistrationsCount === 5 &&
      activeRegistrationsInDb === 5
    ) {
      console.log('\n🎉 PASS: ZERO OVERBOOKING! The capacity rule held under 100% concurrent load!\n');
    } else {
      console.error('\n❌ FAIL: Concurrency violation detected!\n');
    }

    // Clean up test data
    await Registration.deleteMany({ workshopId: workshop._id });
    await Workshop.deleteOne({ _id: workshop._id });

    await disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(1);
  }
};

runConcurrencyTest();
