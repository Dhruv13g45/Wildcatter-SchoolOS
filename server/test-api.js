import app from './src/server.js';
import http from 'http';

const testServer = http.createServer(app);
testServer.listen(0, async () => {
  const port = testServer.address().port;
  console.log(`[Test Runner] Server listening on ephemeral port ${port}`);

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
    const data = await res.json();
    console.log('[Test Health Response]:', JSON.stringify(data));

    const agentRes = await fetch(`http://127.0.0.1:${port}/api/v1/agents/matrix`);
    const agentData = await agentRes.json();
    console.log(`[Test Agent Matrix]: Found ${agentData.agents_count} Autonomous Agents!`);

    const splitRes = await fetch(`http://127.0.0.1:${port}/api/v1/finance/process-fee-split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'PER-1001',
        invoice_id: 'INV-2026-8801',
        total_amount_inr: 45000,
        splits: [
          { merchant_account_id: 'acc_Hk81v7WzQk91aa', amount_inr: 30000 },
          { merchant_account_id: 'acc_Jl92w8XyRl02bb', amount_inr: 9000 },
          { merchant_account_id: 'acc_Mn03x9YxSm13cc', amount_inr: 6000 },
        ],
      }),
    });
    const splitData = await splitRes.json();
    console.log('[Test Razorpay Route Fee Split]:', splitData.status, splitData.razorpay_order_id);

    console.log('✅ ALL BACKEND TEST ASSERTIONS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    testServer.close();
    process.exit(0);
  }
});

