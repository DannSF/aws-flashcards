import { test, expect } from "@playwright/test";
import { challengeQuestions } from "../src/data/challenges";
async function choose(page: import("@playwright/test").Page, correct: boolean) {
  const prompt = await page.locator(".challenge-question h2").innerText();
  const q = challengeQuestions.find((q) => q.prompt === prompt)!;
  const option = correct
    ? q.correctId
    : q.options.find((o) => o.id !== q.correctId)!.id;
  await page
    .locator(".challenge-option")
    .filter({ has: page.locator(`input[value="${option}"]`) })
    .click();
  await page
    .getByRole("button", { name: /Confirmar respuesta|Finalizar evaluación/ })
    .click();
  return q;
}
test("practice teaches after confirmation, resumes after refresh, scores mistakes and retries independently", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Probar mi conocimiento" }).click();
  await page.getByRole("button", { name: "Empezar reto", exact: true }).click();
  await expect(page.locator(".challenge-explanation")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Confirmar respuesta" }),
  ).toBeDisabled();
  await choose(page, false);
  await expect(page.getByRole("status")).toContainText(
    "Una oportunidad para aprender",
  );
  await expect(page.locator(".challenge-explanation")).toContainText(
    "Tu elección",
  );
  await expect(page.getByRole("radio").first()).toBeDisabled();
  await page.reload();
  await page
    .getByRole("button", { name: "Reta tu conocimiento", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continuar reto", exact: true })
    .click();
  await expect(page.locator(".challenge-explanation")).toBeVisible();
  await page.getByRole("button", { name: "Siguiente pregunta" }).click();
  for (let i = 1; i < 10; i++) {
    await choose(page, true);
    await page
      .getByRole("button", {
        name: i === 9 ? "Ver mi resultado" : "Siguiente pregunta",
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Acertaste 9 de 10 · 90%" }),
  ).toBeVisible();
  await expect(page.locator(".question-review")).toHaveCount(1);
  await page.locator(".question-review summary").click();
  await expect(page.locator(".question-review")).toContainText("Tu elección");
  await page.getByRole("button", { name: "Practicar mis 1 errores" }).click();
  await choose(page, true);
  await page.getByRole("button", { name: "Ver mi resultado" }).click();
  await expect(
    page.getByRole("heading", { name: "Acertaste 1 de 1 · 100%" }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("cloudrecall.progress.v1")!),
  );
  expect(saved.history).toEqual([]);
  expect(saved.cards).toEqual({});
  expect(saved.challenges).toHaveLength(2);
  expect(Object.keys(saved.challenges[0].answers)).toHaveLength(10);
});
test("full evaluation covers all 114 cards, withholds answers, and reports 80 percent with 23 mistakes", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto("/");
  await page.getByRole("button", { name: "Probar mi conocimiento" }).click();
  await page
    .getByRole("button", { name: "Comenzar evaluación completa" })
    .click();
  for (let i = 0; i < 114; i++) {
    await expect(page.locator(".challenge-explanation")).toHaveCount(0);
    await choose(page, i < 91);
    if (i === 19) {
      await page.reload();
      await page
        .getByRole("button", { name: "Reta tu conocimiento", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Continuar reto", exact: true })
        .click();
      await expect(page.locator(".session-progress")).toContainText(
        "Pregunta 21 de 114",
      );
    }
  }
  await expect(
    page.getByRole("heading", { name: "Acertaste 91 de 114 · 80%" }),
  ).toBeVisible();
  await expect(page.locator(".question-review")).toHaveCount(23);
  await page.screenshot({
    path: "test-results/challenge-result.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Todas (114)", exact: true }).click();
  await expect(page.locator(".question-review")).toHaveCount(114);
  await page.getByRole("button", { name: "Elegir otro reto" }).click();
  await expect(
    page.getByRole("heading", { name: "Acertaste 80% de tus 114 tarjetas" }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("cloudrecall.progress.v1")!),
  );
  expect(new Set(saved.challenges[0].questionIds).size).toBe(114);
  expect(saved.history).toEqual([]);
});
test("mobile domain challenges stay in scope and remain usable without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Probar mi conocimiento" }).click();
  await page.getByLabel("Dominio del reto").selectOption("security");
  await expect(
    page.getByRole("heading", { name: "Evaluar todo este dominio" }),
  ).toBeVisible();
  await expect(page.locator(".challenge-scope")).toContainText("30 preguntas");
  await page.getByRole("button", { name: "Empezar reto", exact: true }).click();
  await expect(page.locator(".session-progress")).toContainText(
    "Security & Compliance",
  );
  await choose(page, false);
  await expect(page.locator(".challenge-explanation")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/challenge-mobile.png",
    fullPage: true,
  });
});
