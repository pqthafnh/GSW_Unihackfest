const { execSync } = require('child_process');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -m "fix: use admin client to bypass RLS in settle/fund routes; complete submission schema migration"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
