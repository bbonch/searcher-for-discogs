import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DSIcon from '../src/js/sfd/components/ds-icon'
import constants from '../src/js/sfd/utils/constants'
import '../src/types'
import $ from 'jquery';

const testSrc = 'some-src'
const settings: DSSettings = {
  defaultSearchSource: constants.searchSources.youTube.value,
  autoPlayRelease: true,
  autoPlayTrack: true
}

beforeAll(() => {
  (global as any).$ = $;
  global.chrome = {
    runtime: {
      getURL: () => {
        return testSrc
      },
      sendMessage: () => { }
    }
  }
  global.ga = () => { }
  global.constants = constants
})

describe('ds-icon component works', () => {
  it('renders to img with src defined', () => {
    render(<DSIcon settings={settings} />)

    const img = screen.getByRole('img')

    expect(img).toBeDefined()
    expect(img).toHaveClass(constants.classes.dsIcon)
    expect(img).toHaveAttribute("src", testSrc)
  })
})

describe('ds-popover component works', () => {
  beforeEach(() => {
    const container = document.createElement('div')
    container.innerHTML = `
    <h1 class="title_1q3xW">
      <span>
        <a>ArtistName</a>
      </span>
    </h1>
    <table>
      <tr>
        <td class="trackTitleNoArtist_ANE8Q">
          <span>TrackName</span>
        </td>
      </tr>
    </table>
     `
    const iconContainer = document.createElement('span')
    container.getElementsByClassName('trackTitleNoArtist_ANE8Q')[0].appendChild(iconContainer)

    document.body.innerHTML = ''
    document.body.appendChild(container)

    render(<DSIcon settings={settings} />, {
      container: iconContainer
    })
  })

  it('ds-popover component opens', async () => {
    const dsIcon = screen.getByRole('img')
    expect(dsIcon).toBeDefined()

    fireEvent.click(dsIcon)

    const dsPopover = await screen.findByRole('tooltip')
    expect(dsPopover).toBeDefined()
  })

  it('ds-spotify component opens', async () => {
    fireEvent.click(screen.getByRole('img'))

    await screen.findByRole('tooltip')

    const sourceChangeBtn = document.querySelector('[data-bs-toggle]')
    expect(sourceChangeBtn).toBeDefined()

    fireEvent.click(sourceChangeBtn as Element)

    const dropDownMenu = document.querySelector('.dropdown ul')
    expect(dropDownMenu).toHaveClass('show')

    const spotifySourceBtn = screen.getByAltText(constants.searchSources.spotify.title)
    expect(spotifySourceBtn).toBeDefined()

    fireEvent.click(spotifySourceBtn)

    const iframe = document.querySelector('iframe')
    expect(iframe).toBeDefined()
  })

  it('ds-deezer component opens', async () => {
    fireEvent.click(screen.getByRole('img'))

    await screen.findByRole('tooltip')

    const sourceChangeBtn = document.querySelector('[data-bs-toggle]')
    fireEvent.click(sourceChangeBtn as Element)

    const deezerSourceBtn = screen.getByAltText(constants.searchSources.deezer.title)
    expect(deezerSourceBtn).toBeDefined()

    fireEvent.click(deezerSourceBtn)

    const iframe = document.querySelector('iframe')
    expect(iframe).toBeDefined()
  })

  it('ds-popover component closes', async () => {
    const dsicon = screen.getByRole('img')

    fireEvent.click(dsicon)

    const dsPopover = await screen.findByRole('tooltip')
    expect(dsPopover).toHaveClass('show')

    fireEvent.click(dsicon)

    await waitFor(() => expect(dsPopover).not.toHaveClass('show'))
  })
})