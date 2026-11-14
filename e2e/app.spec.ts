import {test,expect} from '@playwright/test';
test('recall ratings persist after refresh and domain study stays in its domain',async({page})=>{
 await page.goto('/');await expect(page.getByText('114',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Continuar estudiando'}).click();
 await expect(page.getByRole('heading',{name:'Variable expense',exact:true})).toHaveCount(0);
 await page.locator('main').click({position:{x:10,y:10}});await page.keyboard.press('Space');
 await expect(page.getByRole('heading',{name:'Variable expense',exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Good/}).click();
 await page.reload();await page.getByRole('button',{name:'Mi progreso'}).click();
 await expect(page.locator('.stat-card').filter({hasText:'Repasos realizados'}).locator('strong')).toHaveText('1');
 await page.getByRole('button',{name:'Mi dashboard'}).click();
 await page.getByRole('button',{name:/DOMINIO 02/}).click();
 await expect(page.locator('.session-progress')).toContainText('Security & Compliance');
 await expect(page.getByRole('heading',{name:'Under the shared responsibility model, who protects AWS physical data centers?'})).toBeVisible();
});
test('library search, explanation dialog, learn introduction, and theme work',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Biblioteca',exact:true}).click();
 await page.getByRole('textbox',{name:'Buscar tarjetas'}).fill('personally identifiable');
 // The library uses the established PII terminology; search by the actual service.
 await page.getByRole('textbox',{name:'Buscar tarjetas'}).fill('Macie');
 await expect(page.locator('.library-card')).toHaveCount(1);await page.locator('.library-card').click();
 await expect(page.getByRole('dialog')).toContainText('Amazon Macie');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.getByRole('button',{name:'Activar modo oscuro'}).click();await expect(page.locator('html')).toHaveClass('dark');await page.reload();await expect(page.locator('html')).toHaveClass('dark');
 await page.getByRole('button',{name:'Aprender algo nuevo'}).click();await expect(page.getByText('CONOCE EL CONCEPTO')).toBeVisible();await page.getByRole('button',{name:'Ya lo entendí. Quiero recordarlo'}).click();
 await expect(page.getByRole('heading',{name:'Variable expense',exact:true})).toHaveCount(0);await expect(page.getByRole('button',{name:'Revelar respuesta'})).toBeVisible();
});
test('invalid imports preserve existing progress and reset requires confirmation',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Continuar estudiando'}).click();await page.getByRole('button',{name:'Revelar respuesta'}).click();await page.getByRole('button',{name:/Easy/}).click();
 const before=await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1'));
 await page.getByRole('button',{name:'Ajustes y datos'}).click();await page.getByLabel('Importar copia JSON').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"cards":null}')});
 await expect(page.getByRole('status')).toContainText('no es una copia válida');expect(await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1'))).toBe(before);
 await page.getByRole('button',{name:'Restablecer progreso',exact:true}).click();await page.getByRole('button',{name:'Cancelar',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1'))).toBe(before);
 await page.getByRole('button',{name:'Restablecer progreso',exact:true}).click();await page.getByRole('button',{name:'Sí, eliminar mi progreso'}).click();expect(JSON.parse((await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1')))! ).history).toHaveLength(0);
});
test('mobile navigation and study have no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.getByRole('heading',{name:/Tu próximo aprendizaje/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/dashboard-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Abrir navegación'}).click();await page.getByRole('button',{name:'Biblioteca',exact:true}).click();await expect(page.getByRole('textbox',{name:'Buscar tarjetas'})).toBeVisible();
 await page.getByRole('button',{name:'Estudiar dominio'}).click();await page.getByRole('button',{name:'Revelar respuesta'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.getByRole('button',{name:/Good/})).toBeVisible();await page.screenshot({path:'test-results/study-mobile.png',fullPage:true});
});
test('desktop dashboard renders without browser errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width:1440,height:1050});await page.goto('/');await expect(page.locator('.domain-card')).toHaveCount(4);await page.screenshot({path:'test-results/dashboard-desktop.png',fullPage:true});expect(errors).toEqual([]);
});
test('exported backup can be imported and malformed stored data is preserved',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Continuar estudiando'}).click();await page.getByRole('button',{name:'Revelar respuesta'}).click();await page.getByRole('button',{name:/Good/}).click();
 await page.getByRole('button',{name:'Ajustes y datos'}).click();
 const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar copia JSON'}).click();const downloaded=await downloading;expect(downloaded.suggestedFilename()).toMatch(/^cloudrecall-.*\.json$/);
 const exported=(await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1')))!;
 await page.getByRole('button',{name:'Restablecer progreso',exact:true}).click();await page.getByRole('button',{name:'Sí, eliminar mi progreso'}).click();
 page.once('dialog',d=>d.accept());await page.getByLabel('Importar copia JSON').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(exported)});
 await expect(page.getByRole('status')).toContainText('Copia importada');expect(JSON.parse((await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1')))! ).history).toHaveLength(1);
 await page.evaluate(()=>localStorage.setItem('cloudrecall.progress.v1','corrupt data'));await page.reload();await expect(page.getByRole('alert')).toContainText('No sobrescribiremos');
 await page.getByRole('button',{name:'Continuar estudiando'}).click();await page.getByRole('button',{name:'Revelar respuesta'}).click();await expect(page.getByRole('button',{name:/Good/})).toBeDisabled();
 expect(await page.evaluate(()=>localStorage.getItem('cloudrecall.progress.v1'))).toBe('corrupt data');
});
