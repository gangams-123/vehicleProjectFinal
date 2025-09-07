import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

//for grid

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    
  ]
};
