import { test, expect } from '@playwright/test';
async function manager(page: import('@playwright/test').Page) {
  await page.getByRole('button', {name:'Mis cursos',exact:true}).click();
}
async function addPython(page: import('@playwright/test').Page) {
  await manager(page);
  await page.getByRole('navigation', {name:'Gestión de cursos'}).getByRole('button',{name:'Explorar ejemplos',exact:true}).click();
  await page.getByRole('button',{name:'Vista previa de Python desde cero'}).click();
  await page.getByRole('button',{name:'Añadir y abrir curso'}).click();
}
test('manage, search, cancel deletion, preserve progress, undo and permanently delete', async ({page}) => {
  await page.goto('/'); await addPython(page);
  await page.getByRole('button',{name:'Continuar estudiando'}).click();
  await page.getByRole('button',{name:'Revelar respuesta'}).click();
  await page.getByRole('button',{name:/Good/}).click();
  const key = 'cloudrecall.course.python-fundamentos.progress.v1';
  const before = await page.evaluate(key => localStorage.getItem(key),key);
  await manager(page);
  await page.getByLabel('Buscar cursos').fill('python');
  await expect(page.locator('.managed-course')).toHaveCount(1);
  await expect(page.locator('.managed-course')).toContainText('1 de 8 tarjetas estudiadas');
  await page.getByRole('button',{name:'Eliminar Python desde cero',exact:true}).click();
  await expect(page.getByLabel('Eliminar también sus repasos, retos y progreso guardados')).not.toBeChecked();
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  expect(await page.evaluate(key => localStorage.getItem(key),key)).toBe(before);
  await page.getByRole('button',{name:'Eliminar Python desde cero',exact:true}).click();
  await page.getByRole('button',{name:'Eliminar curso',exact:true}).click();
  await expect(page.getByRole('button',{name:'Cambiar curso: AWS Cloud Practitioner',exact:true})).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key),key)).toBe(before);
  await expect(page.locator('.managed-course')).toHaveCount(0);
  await page.getByRole('button',{name:'Deshacer',exact:true}).click();
  await expect(page.locator('.managed-course')).toHaveCount(1);
  await page.getByRole('button',{name:'Abrir curso',exact:true}).click();
  await expect(page.getByRole('button',{name:'Cambiar curso: Python desde cero',exact:true})).toBeVisible();
  await manager(page);
  await page.getByRole('button',{name:'Eliminar Python desde cero',exact:true}).click();
  await page.getByLabel('Eliminar también sus repasos, retos y progreso guardados').check();
  await page.getByRole('button',{name:'Eliminar curso y progreso',exact:true}).click();
  expect(await page.evaluate(key => localStorage.getItem(key),key)).toBeNull();
  await page.getByRole('button', {name:'Mi dashboard',exact:true}).click(); await page.reload();
  await expect(page.getByRole('button',{name:'Cambiar curso: AWS Cloud Practitioner',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/^Cambiar curso:/}).click();
  await expect(page.getByRole('region',{name:'Cambiar de curso'}).getByRole('button', {name:/^Cambiar a /})).toHaveCount(1);
});
test('reimporting a removed package resumes retained progress', async ({page}) => {
  await page.goto('/'); await addPython(page);
  await page.getByRole('button',{name:'Continuar estudiando'}).click();
  await page.getByRole('button',{name:'Revelar respuesta'}).click();
  await page.getByRole('button',{name:/Good/}).click();
  await manager(page);
  await page.getByRole('button',{name:'Eliminar Python desde cero',exact:true}).click();
  await page.getByRole('button',{name:'Eliminar curso',exact:true}).click();
  await page.getByRole('button', {name:'Mi dashboard',exact:true}).click(); await addPython(page); await manager(page);
  await expect(page.getByRole('article',{name:'Python desde cero',exact:true})).toContainText('1 de 8 tarjetas estudiadas');
});
test('courses live in sidebar and a reloadable page with browser navigation', async ({page}) => {
  await page.goto('/');
  await manager(page);
  await expect(page).toHaveURL(/#courses$/);
  await expect(page.getByRole('heading',{name:'Mis cursos.',exact:true})).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.screenshot({path:'test-results/courses-desktop.png',fullPage:true});
  await expect(page.getByRole('button',{name:'Mis cursos',exact:true})).toHaveAttribute('aria-current','page');
  await page.reload();
  await expect(page.getByRole('heading',{name:'Mis cursos.',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Mi dashboard',exact:true}).click();
  await expect(page.getByRole('heading',{name:/Tu próximo aprendizaje/})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading',{name:'Mis cursos.',exact:true})).toBeVisible();
});
