// Expo Router native intent redirect for deep linking
export function redirectSystemPath({ path }: { path: string }) {
  // Ensure /exams/join always routes correctly
  if (path === '/exams/join') {
    return '/exams/join';
  }
  // Add more custom redirects if needed
  return path;
} 