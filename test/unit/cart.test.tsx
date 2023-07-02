import '@testing-library/jest-dom'
import React from 'react'
import { Application } from '../../src/client/Application'
import {
  fireEvent,
  getByRole,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { initStore } from '../../src/client/store'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { CartApi, ExampleApi } from '../../src/client/api'
import { CartItem, CartState, CheckoutFormData } from '../../src/common/types'

// class fakeExampleApi {
//   constructor(private readonly basename: string) {}
//   async getProducts() {
//     return await Promise.resolve({
//       data: [{ id: 1, name: 'Some good', price: 100500 }],
//     })
//   }

//   async getProductById(id: number) {
//     return await Promise.resolve({
//       data: [
//         {
//           id: 1,
//           name: 'Some good',
//           price: 100500,
//           description: 'Bla bla bla',
//           material: 'metal',
//           color: 'blue',
//         },
//       ].find((el) => el.id === id),
//     })
//   }

//   async checkout(form: CheckoutFormData, cart: CartState) {
//     return await Promise.resolve({ data: [1] })
//   }
// }

// const fakeCartApi = {
//   getState(): CartState {
//     try {
//       const json = localStorage.getItem(LOCAL_STORAGE_CART_KEY)
//       return (JSON.parse(json) as CartState) || {}
//     } catch {
//       return {}
//     }
//   },

//   setState(cart: CartState) {
//     localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart))
//   }
// }

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

  it.skip('В корзине должна отображаться таблица с добавленными в нее товарами', async () => {
    const { getByTestId } = render(application)
    expect(getByTestId(777)).toBeTruthy()
    expect(getByTestId(888)).toBeTruthy()
    expect(getByTestId(999)).toBeTruthy()
    // expect(getByRole(document.body, 'table')).toMatchSnapshot()
  })

  it.skip('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
    const { getByTestId } = render(application)
    const link = getByTestId('cart-link')
    expect(link).toHaveTextContent(
      `Cart (${Object.entries(fakeProducts).length})`
    )
    // expect(getByTestId('menu')).toMatchSnapshot()
  })

  it.skip('Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
    const { getByTestId } = render(application)
    // const table = getByRole(document.body, 'table')
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

    // expect(table).toMatchSnapshot()
  })

  it.skip('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const { getByTestId } = render(application)
    const button = getByTestId('clear')
    expect(button).toHaveTextContent(`Clear shopping cart`)

    const table = getByRole(document.body, 'table')
    expect(table).toBeInTheDocument()

    fireEvent.click(button)
    expect(table).not.toBeInTheDocument()
    // expect(document.body).toMatchSnapshot()
  })

  it.skip('Если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
    const { getByTestId } = render(application)
    const button = getByTestId('clear')

    if (Object.entries(fakeProducts).length > 0) {
      fireEvent.click(button)
    }

    const link = getByTestId('to-catalog')
    expect(link).toBeInTheDocument()
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

  it.skip('Ввод корректного имени в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const nameInput = getByTestId('f-name')
    expect(nameInput).toBeInTheDocument()
    fireEvent.change(nameInput, { target: { value: 'Boris' } })
    expect(nameInput).not.toHaveClass('is-invalid')
    
    // expect(nameInput).toMatchSnapshot()
  })

  it.skip('Ввод корректного номера телефона в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const phoneInput = getByTestId('f-phone')
    expect(phoneInput).toBeInTheDocument()
    fireEvent.change(phoneInput, { target: { value: '8800555335' } })
    expect(phoneInput).not.toHaveClass('is-invalid')
    
    // expect(phoneInput).toMatchSnapshot()
  })

  it.skip('Ввод корректного адресса в поле ввода соответсвует правилам валидации', () => {
    const { getByTestId } = render(application)
    const addressInput = getByTestId('f-address')
    expect(addressInput).toBeInTheDocument()
    fireEvent.change(addressInput, { target: { value: 'Ufa' } })
    expect(addressInput).not.toHaveClass('is-invalid')

    // expect(addressInput).toMatchSnapshot()
  })

  it('Если ввести валидные данные, то форма засабмитится', async () => {
    const { getByTestId } = render(application)

    const nameInput = getByTestId('f-name')
    const phoneInput = getByTestId('f-phone')
    const addressInput = getByTestId('f-address')
    fireEvent.change(nameInput, { target: { value: 'Boris' } })
    fireEvent.change(phoneInput, { target: { value: '8800555335' } })
    fireEvent.change(addressInput, { target: { value: 'Ufa' } })
    
    const button = getByTestId('submit')
    fireEvent.click(button)

    expect(button).not.toBeInTheDocument()
    expect(getByTestId('done-message')).toBeInTheDocument()

    expect(getByTestId('done-message')).toMatchSnapshot()
  })

})
