const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

console.log('Reading environment variables...');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

console.log('Environment file name: ', envFile);
const envPath = path.resolve(process.cwd(), envFile);

let envVars = {};
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envFile}`);
  envVars = dotenv.parse(fs.readFileSync(envPath));
} else {
  console.log(`${envFile} not found, using system environment variables`);
}

const combinedEnv = { ...envVars, ...process.env };

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating runtime configuration...');
const runtimeConfig = {};

Object.keys(combinedEnv).forEach(key => {
  if (key.startsWith('NEXT_PUBLIC_')) {
    runtimeConfig[key] = combinedEnv[key];
  }
});

console.log('runtimeConfig--->', runtimeConfig);

const configPath = path.join(publicDir, 'runtime-config.js');
const configContent = `window.__RUNTIME_CONFIG__ = ${JSON.stringify(
  runtimeConfig
)};`;
fs.writeFileSync(configPath, configContent);
console.log('Runtime config generated with current environment values');
