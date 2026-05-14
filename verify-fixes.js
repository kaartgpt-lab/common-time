/**
 * Verification Script - Checkout Fixes
 * Checks all modified files for required changes
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const results = {
  passed: [],
  failed: [],
};

function checkFile(filePath, checks) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    results.failed.push(`❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, "utf-8");

  for (const [checkName, searchString] of Object.entries(checks)) {
    if (content.includes(searchString)) {
      results.passed.push(`✅ ${filePath} - ${checkName}`);
    } else {
      results.failed.push(`❌ ${filePath} - ${checkName} - NOT FOUND`);
    }
  }
}

console.log("=".repeat(70));
console.log("VERIFICATION SCRIPT - CHECKOUT FIXES");
console.log("=".repeat(70));
console.log("");

// Check 1: CORS Headers
console.log("Checking CORS Configuration...");
checkFile("supabase/functions/_shared/cors.ts", {
  "Access-Control-Allow-Origin": `"Access-Control-Allow-Origin": "*"`,
  "Accept header": '"accept"',
  "Multiple methods": '"Access-Control-Allow-Methods"',
  "Max age": '"Access-Control-Max-Age"',
});
console.log("");

// Check 2: Create Order Function
console.log("Checking Create Order Function...");
checkFile("supabase/functions/create-order/index.ts", {
  "Bearer prefix check": `?.startsWith("Bearer ")`,
  "Dev mode check": `Deno.env.get("DEV_MODE")`,
  "Mock razorpay order ID": `dev_order_`,
  "Amount in paise": `totalAmount * 100`,
  "Response includes razorpay_order_id": `razorpay_order_id:`,
  "Response includes amount": `amount:`,
  "Response includes dev_mode": `dev_mode:`,
  "Console error logging": `console.error`,
});
console.log("");

// Check 3: Verify Payment Function
console.log("Checking Verify Payment Function...");
checkFile("supabase/functions/verify-payment/index.ts", {
  "Dev mode support": `if (devMode)`,
  "Bearer validation": `?.startsWith("Bearer ")`,
  "Order update in dev mode": `await supabaseAdmin.from("orders").update`,
});
console.log("");

// Check 4: API Service
console.log("Checking API Service...");
checkFile("src/services/api.js", {
  "Error handling in getAuthHeaders": `try {`,
  "Session error logging": `console.error("Session error"`,
  "Error logging in createOrder": `console.error("Create order error"`,
  "Error logging in verifyPayment": `console.error("Verify payment error"`,
  "URL validation": `if (!url)`,
});
console.log("");

// Check 5: Checkout Component
console.log("Checking Checkout Component...");
checkFile("src/pages/Checkout.jsx", {
  "No async at module level": `const response = await createOrder`,
  "Dev mode check": `response.dev_mode`,
  "Console logging for order": `console.log("Creating order"`,
  "Error logging": `console.error("Checkout error"`,
  "Validation for razorpay_order_id": `if (!razorpay_order_id || !amount)`,
});
console.log("");

// Check 6: Dev Mode Environment
console.log("Checking Environment Configuration...");
const envPath = path.join(__dirname, "supabase/functions/.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  if (envContent.includes("DEV_MODE=true")) {
    results.passed.push("✅ .env.local - DEV_MODE configured");
  } else {
    results.failed.push("❌ .env.local - DEV_MODE not set to true");
  }
} else {
  results.failed.push("❌ .env.local - File not found");
}
console.log("");

// Summary
console.log("=".repeat(70));
console.log("VERIFICATION SUMMARY");
console.log("=".repeat(70));
console.log("");

if (results.passed.length > 0) {
  console.log(`✅ PASSED: ${results.passed.length}`);
  results.passed.forEach((p) => console.log(`   ${p}`));
  console.log("");
}

if (results.failed.length > 0) {
  console.log(`❌ FAILED: ${results.failed.length}`);
  results.failed.forEach((f) => console.log(`   ${f}`));
  console.log("");
}

const totalTests = results.passed.length + results.failed.length;
const passRate = Math.round((results.passed.length / totalTests) * 100);

console.log("=".repeat(70));
console.log(`STATUS: ${passRate}% (${results.passed.length}/${totalTests})`);

if (results.failed.length === 0) {
  console.log("✅ ALL CHECKS PASSED - Ready for testing!");
} else {
  console.log(`⚠️  ${results.failed.length} checks failed - Review above`);
}

console.log("=".repeat(70));
console.log("");

console.log("Next Steps:");
console.log("1. Start dev server: npm run dev");
console.log("2. Open http://localhost:5173");
console.log("3. Test checkout flow with dev mode");
console.log("4. Check browser console for errors");
console.log("5. Verify order is created in database");
