import '@testing-library/jest-dom'
import React from 'react'
import { Application } from '../../src/client/Application'
import { fireEvent, getByRole, getByText, render } from '@testing-library/react'
import { initStore } from '../../src/client/store'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { CartApi, ExampleApi } from '../../src/client/api'
import { CartItem, CartState } from '../../src/common/types'

const fakeProducts: CartState = {
  777: {
    name: 'not fake state',
    price: 86850,
    count: 5,
  },
  888: {
    name: 'very fake state',
    price: 918,
    count: 9180,
  },
  999: {
    name: 'fake state',
    price: 100500,
    count: 3030,
  },
}

const fakeCartApi = new CartApi()
fakeCartApi.getState = jest.fn((): CartState => fakeProducts)

describe('Корзина', () => {
  const store = initStore(new ExampleApi('/hw/store'), fakeCartApi)
  const application = (
    <MemoryRouter initialEntries={['/cart']} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  )

  it('В корзине должна отображаться таблица с добавленными в нее товарами', async () => {
    const { getByTestId } = render(application)
    expect(getByTestId(777)).toBeTruthy()
    expect(getByTestId(888)).toBeTruthy()
    expect(getByTestId(999)).toBeTruthy()
  })

  it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
    const { getByTestId } = render(application)
    const link = getByTestId('cart-link')
    expect(link).toHaveTextContent(
      `Cart (${Object.entries(fakeProducts).length})`
    )
  })

  it('Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
    const { getByTestId } = render(application)
    let total = 0

    for (const id of Object.keys(fakeProducts)) {
      const row = getByTestId(id)
      const product: CartItem = fakeProducts[+id]
      expect(row).toContainElement(getByText(row, product.name))
      expect(row).toContainElement(getByText(row, `$${product.price}`))
      expect(row).toContainElement(getByText(row, product.count))

      const totalProd = product.price * product.count
      expect(row).toContainElement(getByText(row, `$${totalProd}`))
      total += totalProd
    }

    expect(getByTestId('total')).toHaveTextContent(`$${total}`)
  })

  it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const { getByTestId } = render(application)
    const button = getByTestId('clear')
    expect(button).toHaveTextContent(`Clear shopping cart`)

    const table = getByRole(document.body, 'table')
    expect(table).toBeInTheDocument()

    fireEvent.click(button)
    expect(table).not.toBeInTheDocument()
  })
})

describe('Пустая корзина', () => {
  const fakeCartApi = new CartApi()
  fakeCartApi.getState = jest.fn((): CartState => {return {}})

  const store = initStore(new ExampleApi('/hw/store'), fakeCartApi)
  const application = (
    <MemoryRouter initialEntries={['/cart']} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  )
  it('Если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
    const { getByTestId } = render(application)
    expect(getByTestId('to-catalog')).toBeInTheDocument()
  })
})

describe('Валидация формы Сheckout', () => {
  const store = initStore(new ExampleApi('/hw/store'), fakeCartApi)
  const application = (
    <MemoryRouter initialEntries={['/cart']} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  )

  it('Ввод корректного имени в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const nameInput = getByTestId('f-name')
    expect(nameInput).toBeInTheDocument()
    fireEvent.change(nameInput, { target: { value: 'Boris' } })
    expect(nameInput).not.toHaveClass('is-invalid')
  })

  it('Ввод корректного номера телефона в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const phoneInput = getByTestId('f-phone')
    expect(phoneInput).toBeInTheDocument()
    fireEvent.change(phoneInput, { target: { value: '8800555335' } })
    expect(phoneInput).not.toHaveClass('is-invalid')
  })

  it('Ввод корректного адресса в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const addressInput = getByTestId('f-address')
    expect(addressInput).toBeInTheDocument()
    fireEvent.change(addressInput, { target: { value: 'Ufa' } })
    expect(addressInput).not.toHaveClass('is-invalid')
  })
})
