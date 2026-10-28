import { createBdd } from 'playwright-bdd';

// Punto único para definir pasos. Si en el futuro se necesitan fixtures propios
// (page objects, datos de prueba), se agregan con test.extend y se pasan a createBdd(test).
export const { Given, When, Then } = createBdd();
