const fs = require('fs');
const path = require('path');

const pages = [
    '/login', '/signup', '/forgot-password', '/reset-password',
    '/dashboard',
    '/inbox',
    '/chatbot-builder',
    '/campaigns',
    '/templates',
    '/contacts', '/segments',
    '/catalog',
    '/payments',
    '/integrations',
    '/settings/profile', '/settings/team', '/settings/preferences',
    '/admin/tenants', '/admin/billing'
];

const basePath = path.join(__dirname, 'src', 'app');

pages.forEach(p => {
    const dir = path.join(basePath, p);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'page.tsx');
    if (!fs.existsSync(file)) {
        // Determine component name from path
        const componentName = p.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())).join('') + 'Page';

        // Add simple component
        const content = `export default function ${componentName}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">${componentName.replace('Page', '')}</h1>
      <p className="mt-2 text-muted-foreground">This section is currently under construction.</p>
    </div>
  );
}
`;
        fs.writeFileSync(file, content);
    }
});
console.log('Pages created successfully.');
