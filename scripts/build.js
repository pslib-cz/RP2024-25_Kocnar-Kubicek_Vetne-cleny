const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const platform = process.argv[2];

if (!platform || !['android', 'ios'].includes(platform)) {
  console.error('Error: Please specify target platform: "android" or "ios"');
  console.error('Usage: node scripts/build.js <android|ios>');
  process.exit(1);
}

const PROJECT_IDS = {
  android: '2f64e818-76b7-4947-9100-4287fa3f8501',
  ios: '564c7e57-4a83-470f-bf71-cac24e431bf4'
};

const appJsonPath = path.resolve(__dirname, '../app.json');

// 1. Check if app.json has uncommitted changes
try {
  const gitStatus = execSync('git status --porcelain app.json', { encoding: 'utf-8' }).trim();
  if (gitStatus) {
    console.error('Error: app.json has uncommitted changes. Please commit or stash changes in app.json before running the build.');
    process.exit(1);
  }
} catch (err) {
  console.error('Error checking git status:', err.message);
  process.exit(1);
}

// 2. Read app.json and store original content
let originalContent;
let appConfig;
try {
  originalContent = fs.readFileSync(appJsonPath, 'utf-8');
  appConfig = JSON.parse(originalContent);
} catch (err) {
  console.error('Error reading app.json:', err.message);
  process.exit(1);
}

if (!appConfig.expo) {
  console.error('Error: Invalid app.json structure (missing "expo" field).');
  process.exit(1);
}

// 3. Increment buildNumber (iOS) and versionCode (Android)
const currentBuildNumber = parseInt(appConfig.expo.ios?.buildNumber || '0', 10);
const newBuildNumber = (currentBuildNumber + 1).toString();

const currentVersionCode = parseInt(appConfig.expo.android?.versionCode || 0, 10);
const newVersionCode = currentVersionCode + 1;

if (!appConfig.expo.ios) appConfig.expo.ios = {};
if (!appConfig.expo.android) appConfig.expo.android = {};
if (!appConfig.expo.extra) appConfig.expo.extra = {};
if (!appConfig.expo.extra.eas) appConfig.expo.extra.eas = {};

appConfig.expo.ios.buildNumber = newBuildNumber;
appConfig.expo.android.versionCode = newVersionCode;
appConfig.expo.extra.eas.projectId = PROJECT_IDS[platform];

// 4. Save updated app.json temporarily for build
try {
  fs.writeFileSync(appJsonPath, JSON.stringify(appConfig, null, 2) + '\n', 'utf-8');
  console.log(`Updated app.json for build:`);
  console.log(`  Platform: ${platform}`);
  console.log(`  Project ID: ${PROJECT_IDS[platform]}`);
  console.log(`  iOS buildNumber: ${currentBuildNumber} -> ${newBuildNumber}`);
  console.log(`  Android versionCode: ${currentVersionCode} -> ${newVersionCode}`);
} catch (err) {
  console.error('Failed to write app.json:', err.message);
  process.exit(1);
}

// 5. Run EAS Build command FIRST
const buildCmd = platform === 'android'
  ? 'eas build -p android --profile production --no-wait'
  : 'eas build -p ios --profile production --auto-submit --no-wait';

console.log(`Running build command: ${buildCmd}`);
try {
  execSync(buildCmd, { stdio: 'inherit' });
} catch (err) {
  console.error('EAS build failed or aborted. Reverting app.json changes...');
  // Restore original app.json on build failure so nothing is committed
  fs.writeFileSync(appJsonPath, originalContent, 'utf-8');
  console.error('app.json has been reverted.');
  process.exit(1);
}

// 6. Commit change ONLY after build succeeds
try {
  console.log('Build started successfully. Staging and committing app.json...');
  execSync('git add app.json', { stdio: 'inherit' });
  const commitMsg = `chore: bump build version for ${platform} (buildNumber: ${newBuildNumber}, versionCode: ${newVersionCode})`;
  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to commit app.json after build:', err.message);
  process.exit(1);
}
