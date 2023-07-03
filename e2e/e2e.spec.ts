import { test, expect } from '@playwright/test'

const BUG_ID = process.env.BUG_ID ? `?bug_id=${process.env.BUG_ID}` : ''
const URL = 'http://localhost:3000/hw/store'

// тесты запускаются с нестабильными данными
// поэтому при прогонах будут падать с диффом по скринам
// не успел разобраться как мокать апи, так что эти тесты
// только для того, чтобы глазами посмотреть 
// на скрины с разной шириной экрана
// 
// test('1440px – Вёрстка должна адаптироваться под ширину экрана', async ({
//   page,
// }) => {
//   await page.setViewportSize({
//     width: 1440,
//     height: 5000,
//   })
//   await page.goto(URL.concat('/catalog', BUG_ID))

//   await expect(page).toHaveScreenshot({ fullPage: true })
// })

// test('768px – Вёрстка должна адаптироваться под ширину экрана', async ({
//   page,
// }) => {
//   await page.setViewportSize({
//     width: 768,
//     height: 5000,
//   })
//   await page.goto(URL.concat('/catalog', BUG_ID))

//   await expect(page).toHaveScreenshot({ fullPage: true })
// })

test('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({
  page,
}) => {
  await page.setViewportSize({
    width: 500,
    height: 3000,
  })
  await page.goto(URL.concat(BUG_ID))

  await expect(page.getByLabel('Toggle navigation')).toBeInViewport()
  await expect(page.getByTestId('menu')).not.toBeInViewport()
})

test('При выборе элемента из меню "гамбургера", меню должно закрываться', async ({
  page,
}) => {
  await page.setViewportSize({
    width: 500,
    height: 3000,
  })
  await page.goto(URL.concat(BUG_ID))
  const burger = page.getByLabel('Toggle navigation')

  await expect(burger).toBeInViewport()
  await burger.click()

  await page.getByRole('link', { name: /catalog/i }).click()
  await expect(page.getByTestId('menu')).not.toBeInViewport()
})
