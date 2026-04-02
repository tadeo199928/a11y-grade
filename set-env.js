const fs = require('fs');

const content = `
export const environment = {
  production: true,
  openRouterKey: '${process.env['openRouterKey']}'
};
`;

fs.writeFileSync('./src/environments/environment.ts', content);
console.log('Environment file generated');