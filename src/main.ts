import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  // Muestra el error en pantalla si la app no arranca
  document.body.innerHTML = `
    <div style="font-family: monospace; padding: 2rem; color: #dc2626; background: #fef2f2; border: 1px solid #fca5a5; margin: 2rem; border-radius: 8px;">
      <strong>Error al iniciar la aplicación</strong><br><br>
      ${err?.message ?? err}
    </div>
  `;
});
