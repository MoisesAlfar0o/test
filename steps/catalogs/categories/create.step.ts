import { expect } from '@playwright/test';
import { Then, When } from '../../fixtures';


Then('veo el formulario de Información general', async ({ page }) => {
  // Valida que el bloque de información general de la imagen esté visible
  await expect(page.getByText('Información general').first()).toBeVisible();
});

Then('verifico que el campo {string} tiene seleccionado {string}', async ({ page }, campo: string, valor: string) => {
  // Para el campo "Estado" que muestra "Activo" por defecto
  const combo = page.getByLabel(campo, { exact: true });
  
  // Dependiendo de si es un <select> nativo o un componente personalizado, 
  // se valida que el texto de la opción seleccionada esté presente.
  await expect(combo).toContainText(valor);
});

When('dejo en blanco el campo {string}', async ({ page }, campo: string) => {
  // Limpia el campo "URL de la imagen" asegurando que quede vacío
  const porEtiqueta = page.getByLabel(campo, { exact: true });
  const porPlaceholder = page.getByPlaceholder(campo, { exact: true });

  await porEtiqueta.or(porPlaceholder).clear();
});