// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   assetsInclude: ['**/*.PNG', '**/*.png']
// });





// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   assetsInclude: ['**/*.PNG', '**/*.png'],
//   server: {
//     https: {
//       key: fs.readFileSync("C:/Users/kadel/Desktop/Bitebox/backend-Bitebox/localhost-key.pem"),
//       cert: fs.readFileSync("C:/Users/kadel/Desktop/Bitebox/backend-Bitebox/localhost-cert.pem"),
//     },
//     port: 5173, // your frontend port
//     proxy: {
//       '/api': {
//         target: 'https://localhost:3000', // your backend URL and port
//         changeOrigin: true,
//         secure: false, // allow self-signed SSL
//       },
//     },
//   },
// });




import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve("./ssl/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve("./ssl/localhost-cert.crt")),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:3000', // Backend URL (make sure backend is also running on HTTPS)
        changeOrigin: true,
        secure: false, // Accept self-signed certificates from backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
