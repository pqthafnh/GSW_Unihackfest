const { execSync } = require('child_process');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -m "fix: admin client throws descriptive error for missing env vars"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
