#!/usr/bin/env node
/**
 * Content Systems Platform — Password hash utility
 * 
 * Usage:
 *   node platform/auth/hash-password.mjs <password>
 * 
 * Output:
 *   The bcrypt hash to set as AUTH_USER_<email_key>=<hash> in Vercel env vars.
 * 
 * Requires: npm install -g bcryptjs  (or run from ui/ with bcryptjs installed)
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node hash-password.mjs <password>');
  process.exit(1);
}

if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);

console.log('\nHash (copy this into your Vercel env var):\n');
console.log(hash);
console.log('\nEnv var key format:');
console.log('  AUTH_USER_<email with @ → _AT_ and . → _DOT_>');
console.log('  e.g. alex@acme.com → AUTH_USER_alex_AT_acme_DOT_com\n');
