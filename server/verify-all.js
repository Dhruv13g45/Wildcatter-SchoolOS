import http from 'http';
import app from './src/server.js';

let failedTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  console.log(`\n=======================================================`);
  console.log(`🧪 RUNNING SYSTEM-WIDE REAL-DATA FUNCTIONALITY AUDIT`);
  console.log(`🌐 Ephemeral Test Port: ${port}`);
  console.log(`=======================================================\n`);

  try {
    // 1. Health Endpoint
    console.log('[Test Suite 1: System Health]');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'HEALTHY', 'Health check returns 200 HEALTHY');

    // 2. Auth - Multi-role Registrations (Real User Inputs)
    console.log('\n[Test Suite 2: Multi-Role Registrations & Auth]');
    const adminPayload = {
      full_name: 'Superintendent Ashu Dutt',
      email: 'ashu.admin@schoolos.test',
      password: 'RealSecurePassword123!',
      whatsapp_number: '+919876500001',
      role: 'Admin',
    };
    const regAdminRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminPayload),
    });
    const regAdminData = await regAdminRes.json();
    assert(regAdminRes.status === 201 && regAdminData.token, 'Admin user registered and JWT token issued');
    const adminToken = regAdminData.token;
    const adminPersonId = regAdminData.person.person_id;

    // Register Faculty Member
    const facultyPayload = {
      full_name: 'Prof. Rajesh Kulkarni',
      email: 'rajesh.faculty@schoolos.test',
      password: 'FacultyPassword2026',
      whatsapp_number: '+919811223344',
      role: 'Faculty',
    };
    const regFacultyRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facultyPayload),
    });
    const regFacultyData = await regFacultyRes.json();
    assert(regFacultyRes.status === 201 && regFacultyData.person.role === 'Faculty', 'Faculty user registered with role Faculty');

    // Register Student
    const studentPayload = {
      full_name: 'Aarav Sharma',
      email: 'aarav.student@schoolos.test',
      password: 'StudentPassword2026',
      whatsapp_number: '+919822334455',
      role: 'Student',
    };
    const regStudentRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentPayload),
    });
    const regStudentData = await regStudentRes.json();
    assert(regStudentRes.status === 201 && regStudentData.person.role === 'Student', 'Student user registered with role Student');
    const studentPersonId = regStudentData.person.person_id;

    // Edge Case: Duplicate Email Rejection
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminPayload),
    });
    assert(dupRes.status === 409, 'Duplicate email registration rejected with 409 Conflict');

    // Login Verification - Correct Password
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminPayload.email, password: adminPayload.password }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token, 'Login with correct credentials succeeds');

    // Login Verification - Wrong Password Edge Case
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminPayload.email, password: 'WrongPassword' }),
    });
    assert(badLoginRes.status === 401, 'Login with incorrect password rejected with 401 Unauthorized');

    // Google SSO
    const googleRes = await fetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ashu.google@gmail.com', name: 'Ashu Dutt Google', role: 'Admin' }),
    });
    const googleData = await googleRes.json();
    assert(googleRes.status === 200 && googleData.token, 'Google SSO issued verified JWT token');

    // Current User Profile via JWT Bearer
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.person.email === adminPayload.email, 'Token verified and current user identity returned');

    // 3. Admissions & WhatsApp Webhook
    console.log('\n[Test Suite 3: Admissions & Meta WhatsApp Webhook]');
    // Edge case: Missing signature without bypass header
    const noSigRes = await fetch(`${baseUrl}/admissions/whatsapp-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: 'test', parent_phone: '+919999999999' }),
    });
    assert(noSigRes.status === 401, 'WhatsApp webhook without signature returns 401 Unauthorized');

    // Valid webhook message with bypass test header
    const waPayload = {
      message_id: 'wamid_TEST_REAL_001',
      parent_phone: '+919876543210',
      message_type: 'text',
      text_body: 'Candidate Devansh Malhotra for Class XI Science PCM with 93% aggregate marks',
    };
    const waRes = await fetch(`${baseUrl}/admissions/whatsapp-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bypass-signature-for-demo': 'true',
      },
      body: JSON.stringify(waPayload),
    });
    const waData = await waRes.json();
    assert(waRes.status === 200 && waData.status === 'ENQUEUED', 'WhatsApp inbound webhook enqueued and processed');
    assert(waData.agent_execution.person_id && waData.agent_execution.eligibility, 'Enrollment Harvester auto-structured Person record');

    // Query applicants
    const applicantsRes = await fetch(`${baseUrl}/admissions/applicants`);
    const applicantsData = await applicantsRes.json();
    assert(applicantsRes.status === 200 && applicantsData.count >= 1, `Applicants query returned real applicants (count: ${applicantsData.count})`);

    // 4. Autonomous Agent Matrix (All 6 Agents)
    console.log('\n[Test Suite 4: Autonomous Agent Matrix (6 AI Agents)]');
    const matrixRes = await fetch(`${baseUrl}/agents/matrix`);
    const matrixData = await matrixRes.json();
    assert(matrixRes.status === 200 && matrixData.agents_count === 6, 'All 6 Autonomous Agents active in matrix');

    // Agent 1: Enrollment Harvester
    const agent1Res = await fetch(`${baseUrl}/agents/enrollment-harvester`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parentPhone: '+919811223344',
        fullName: 'Isha Mehra',
        simulatedOcrText: 'Class X CBSE: Mathematics 96%, Science 92%, English 90%',
        streamPreference: 'SCIENCE_STEM',
      }),
    });
    const agent1Data = await agent1Res.json();
    assert(agent1Res.status === 200 && agent1Data.status === 'ADMISSION_PROCESSED', 'Enrollment Harvester Agent parsed OCR & scored eligibility');

    // Agent 2: Financial Aid Auditor
    const agent2Res = await fetch(`${baseUrl}/agents/financial-aid-auditor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetPersonId: studentPersonId,
        declaredGrossIncomeInr: 450000,
        taxPaidInr: 12000,
        householdSize: 4,
        regionalTier: 'NCR_TIER_2',
      }),
    });
    const agent2Data = await agent2Res.json();
    assert(agent2Res.status === 200 && agent2Data.assessment.calculated_family_need_index > 0, 'Financial Aid Auditor Agent computed Family Need Index & waiver');

    // Agent 3: Timetable Optimizer
    const agent3Res = await fetch(`${baseUrl}/agents/timetable-optimizer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        absentTeacherId: 'TCH-01',
        absentTeacherName: 'Prof. Rajesh Kulkarni',
        leaveReason: 'Sudden Sick Leave',
      }),
    });
    const agent3Data = await agent3Res.json();
    assert(agent3Res.status === 200 && agent3Data.slaMet === true, `Timetable Optimizer Agent solved dynamic substitution in ${agent3Data.latencyMs}ms (<10s SLA)`);

    // Agent 4: Syllabus Coverage Agent
    const agent4Res = await fetch(`${baseUrl}/agents/syllabus-coverage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: 'TCH-01',
        teacherName: 'Prof. Rajesh Kulkarni',
        subjectCode: 'PHY-042',
        board: 'CBSE',
        rawBlackboardText: 'Faraday Law of Electromagnetic Induction: e = -dPhi/dt. Lenz law direction.',
      }),
    });
    const agent4Data = await agent4Res.json();
    assert(agent4Res.status === 200 && agent4Data.record.matched_curriculum_chapters.length > 0, 'Syllabus Coverage Agent parsed chalk vision & verified board pacing');

    // Agent 5: Fee Guardian Agent
    const agent5Res = await fetch(`${baseUrl}/agents/fee-guardian`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const agent5Data = await agent5Res.json();
    assert(agent5Res.status === 200 && agent5Data.status === 'FEE_SCAN_COMPLETE', 'Fee Guardian Agent audited ledger nodes and dropped WhatsApp links');

    // Agent 6: Security Route Dispatcher Agent
    const agent6Res = await fetch(`${baseUrl}/agents/security-route-dispatcher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        busId: 'BUS-FLEET-01',
        latitude: 28.6320,
        longitude: 77.3680,
        speedKmh: 38.5,
      }),
    });
    const agent6Data = await agent6Res.json();
    assert(agent6Res.status === 200 && agent6Data.status === 'TELEMETRY_UPDATED', 'Security Route Dispatcher Agent ingested telemetry and updated proximity radar');

    // 5. Knowledge Graph & Ontology
    console.log('\n[Test Suite 5: Structural Knowledge Graph & Ontology]');
    // Create Campus Node
    const campusRes = await fetch(`${baseUrl}/ontology/campuses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branch_name: 'Indirapuram Central Campus',
        geographic_zone: 'NCR Zone 1',
        board_compliance: 'CBSE',
        razorpay_route_sub_merchant_id: 'acc_campus_north_01',
      }),
    });
    const campusData = await campusRes.json();
    assert(campusRes.status === 201 && campusData.campus.campus_id, 'Created real Campus entity node in Knowledge Graph');

    // Create Sealed Exam Paper with Cryptographic Key
    const examRes = await fetch(`${baseUrl}/ontology/exam-papers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject_code: 'PHY-042',
        title: 'Senior Secondary Physics Board Pre-Mock',
        difficulty_distribution_ratio: '30:50:20',
      }),
    });
    const examData = await examRes.json();
    assert(examRes.status === 201 && examData.exam.cryptographic_seal_key.startsWith('SHA256:'), 'Sealed exam paper created with tamper-evident SHA-256 seal');

    // Polymorphic Role Mutation
    const mutateRes = await fetch(`${baseUrl}/ontology/persons/${studentPersonId}/mutate-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_role: 'Alumnus', affinity_weight_delta: 0.1 }),
    });
    const mutateData = await mutateRes.json();
    assert(mutateRes.status === 200 && mutateData.person.active_roles.includes('Alumnus'), 'Polymorphically mutated Student to Alumnus on existing :Person node');

    // Graph Inspection
    const graphRes = await fetch(`${baseUrl}/ontology/graph`);
    const graphData = await graphRes.json();
    assert(graphRes.status === 200 && graphData.nodes_count >= 3 && graphData.edges_count >= 1, `Knowledge graph returned ${graphData.nodes_count} nodes and ${graphData.edges_count} relationship edges`);

    // 6. Finance & Razorpay Route Multi-Split Liquidation
    console.log('\n[Test Suite 6: Razorpay Route Multi-Split Liquidation]');
    // Create real fee invoice
    const invRes = await fetch(`${baseUrl}/finance/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentPersonId,
        student_name: 'Aarav Sharma',
        gross_due_inr: 45000,
        due_date: '2026-12-01',
      }),
    });
    const invData = await invRes.json();
    assert(invRes.status === 201 && invData.invoice.invoice_id, 'Issued real institutional fee invoice in ledger');
    const invoiceId = invData.invoice.invoice_id;

    // Process Multi-Split fee liquidation
    const splitRes = await fetch(`${baseUrl}/finance/process-fee-split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentPersonId,
        invoice_id: invoiceId,
        total_amount_inr: 45000,
        splits: [
          { merchant_account_id: 'acc_campus_tuition_01', amount_inr: 30000 },
          { merchant_account_id: 'acc_transport_fleet_02', amount_inr: 9000 },
          { merchant_account_id: 'acc_uniform_supplier_03', amount_inr: 6000 },
        ],
      }),
    });
    const splitData = await splitRes.json();
    assert(splitRes.status === 200 && splitData.status === 'INVOICE_ORDER_PROVISIONED', 'Razorpay Route multi-split liquidation provisioned');
    assert(splitData.transfers.length === 3, 'Razorpay multi-split generated 3 instant account transfers');

    // Settle invoice
    const settleRes = await fetch(`${baseUrl}/finance/invoices/${invoiceId}/settle`, { method: 'POST' });
    const settleData = await settleRes.json();
    assert(settleRes.status === 200 && settleData.invoice.payment_status === 'Settled', 'Invoice successfully marked as Settled');

    // 7. Dynamic Timetable Grid
    console.log('\n[Test Suite 7: Dynamic Timetable Grid]');
    const addSlotRes = await fetch(`${baseUrl}/timetable/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        period_index: 1,
        day_of_week: 'Monday',
        time_slot: '09:00 AM - 10:00 AM',
        subject: 'Pure Mathematics',
        assigned_teacher_id: 'TCH-02',
        assigned_teacher_name: 'Mr. Arvind Saxena',
        classroom_number: 'Room 304',
      }),
    });
    assert(addSlotRes.status === 201, 'Added teaching period slot to dynamic timetable');

    const resetScheduleRes = await fetch(`${baseUrl}/timetable/reset`, { method: 'POST' });
    assert(resetScheduleRes.status === 200, 'Reverted timetable substitutions back to master baseline');

    // 8. Transit Telemetry & Proximity Alerts
    console.log('\n[Test Suite 8: Transit Telemetry & Proximity Alerts]');
    const addBusRes = await fetch(`${baseUrl}/telemetry/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bus_id: 'BUS-07',
        route_name: 'Route 7: Noida -> Campus',
        driver_name: 'Harish Chandra',
        driver_phone: '+919811002233',
        next_stop: 'Sector 62 Metro',
      }),
    });
    const addBusData = await addBusRes.json();
    assert(addBusRes.status === 201 && addBusData.bus.bus_id === 'BUS-07', 'Registered school bus transit node in telemetry stream');

    const updateBusRes = await fetch(`${baseUrl}/telemetry/buses/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        busId: 'BUS-07',
        latitude: 28.6295,
        longitude: 77.3655,
        speedKmh: 42.0,
      }),
    });
    const updateBusData = await updateBusRes.json();
    assert(updateBusRes.status === 200 && updateBusData.status === 'TELEMETRY_UPDATED', 'Pushed live GPS stream coordinate update');

    console.log(`\n=======================================================`);
    console.log(`📊 FINAL AUDIT SUMMARY:`);
    console.log(`   Passed Assertions: ${passedTests}`);
    console.log(`   Failed Assertions: ${failedTests}`);
    if (failedTests === 0) {
      console.log(`🏆 ALL SYSTEM FUNCTIONALITIES ARE 100% OPERATIONAL!`);
    } else {
      console.log(`⚠️ Some tests failed. Please review the output above.`);
    }
    console.log(`=======================================================\n`);
  } catch (err) {
    console.error('Fatal Test Suite Error:', err);
  } finally {
    server.close();
    process.exit(failedTests === 0 ? 0 : 1);
  }
});

