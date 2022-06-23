import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DSIcon from '../src/js/sfd/components/ds-icon'
import constants from '../src/js/sfd/services/constants'

const testSrc = 'some-src'

beforeAll(() => {
  global.chrome = {
    runtime: {
      getURL: () => {
        return testSrc
      }
    }
  }

  global.constants = constants
})

test('renders to img with src defined', () => {
  render(<DSIcon />)

  const img = screen.getByRole('img')

  expect(img).toBeDefined()
  expect(img).toHaveClass(constants.classes.dsIcon)
  expect(img).toHaveAttribute("src", testSrc)
})