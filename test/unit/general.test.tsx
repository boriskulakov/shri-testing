import React from 'react'
import { Application } from '../../src/client/Application'
import { render } from '@testing-library/react'
import { initStore } from '../../src/client/store'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { CartApi, ExampleApi } from '../../src/client/api'

describe('Общие требования', () => {
  const store = initStore(new ExampleApi('/hw/store'), new CartApi())
  const application = (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  )

  it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
    const { getByTestId } = render(application)

    expect(getByTestId('market-name').getAttribute('href')).toEqual('/')
  })

  it('В шапке отображается ссылка на страницу каталога', () => {
    const { getByRole } = render(application)
    const link = getByRole('link', { name: /catalog/i })
    expect(link).toBeTruthy()
  })

  it('В шапке отображается ссылка на страницу delivery', () => {
    const { getByRole } = render(application)
    const link = getByRole('link', { name: /delivery/i })
    expect(link).toBeTruthy()
  })

  it('В шапке отображается ссылка на страницу контактов', () => {
    const { getByRole } = render(application)
    const link = getByRole('link', { name: /contacts/i })
    expect(link).toBeTruthy()
  })

  it('В шапке отображается ссылка на страницу корзины', () => {
    const { getByRole } = render(application)
    const link = getByRole('link', { name: /cart/i })
    expect(link).toBeTruthy()
  })
})
