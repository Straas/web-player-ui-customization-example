const straasPlayerUrl = 'https://app.straas.net/sdk/3.5.0/player-sdk.js'
import getFlattenedPromise from './utilities/flattenedPromise'

interface StraasWindow extends Window {
  StraaS: any
  StraaSOnInit: () => void
}

interface IndexableStrings {
  [index: string]: string
}

function loadStraasPlayerJs() {
  const head = document.getElementsByTagName('head')[0]
  const scriptElement = document.createElement('script')

  scriptElement.src = straasPlayerUrl

  head.append(scriptElement)
}

function installEvents(player: any, eventDispatcher: HTMLElement) {
  eventDispatcher.addEventListener('requestPlay', () => {
    player.playVideo()
  })

  eventDispatcher.addEventListener('requestPause', () => {
    player.pauseVideo()
  })

  eventDispatcher.addEventListener('requestSeek', (event) => {
    const currentTime = (event as CustomEvent).detail
    player.currentTime = currentTime
  })

  eventDispatcher.addEventListener('requestFullscreen', (event) => {
    eventDispatcher.requestFullscreen()
  })

  eventDispatcher.addEventListener('requestExitFullscreen', () => {
    document.exitFullscreen()
  })

  eventDispatcher.addEventListener('requestForward', (event) => {
    const forwardSeconds = (event as CustomEvent).detail
    const availableForwardSeconds = player.currentTime + forwardSeconds < player.duration
      ? forwardSeconds : player.duration - player.currentTime

    player.currentTime = Math.floor(player.currentTime + availableForwardSeconds)
  })

  eventDispatcher.addEventListener('requestReplay', (event) => {
    const replaySeconds = (event as CustomEvent).detail
    player.currentTime -= Math.min(replaySeconds, player.currentTime)
  })

  eventDispatcher.addEventListener('requestLevelChange', (event) => {
    const level = (event as CustomEvent).detail
    player.level = level.name === 'auto' ? -1 : level.idx
  })

  eventDispatcher.addEventListener('requestPlaybackSpeed', (event) => {
    const speed = (event as CustomEvent).detail
    player.playbackSpeed = speed
  })

  eventDispatcher.addEventListener('requestVolume', (event) => {
    const volume = (event as CustomEvent).detail
    player.volume = volume
  })

  eventDispatcher.addEventListener('requestMute', (event) => {
    const muted = (event as CustomEvent).detail
    player.muted = muted
  })
}

async function loadVideo(containingElementSelector: string, eventDispatcher: HTMLElement) {
  const { promise, resolve, reject } = getFlattenedPromise<any>()

  const straasWin: StraasWindow = (window as unknown) as StraasWindow

  const response = await window.fetch('https://demo.straas.net/api/apptoken')

  if (!response.ok) {
    throw new Error('Get app token failed')
  }

  const data = await response.json()
  straasWin.StraaSOnInit = function () {
    const StraaS = straasWin.StraaS
    const Player = StraaS.Player

    const mediaConfig: IndexableStrings = {
      type: Player.Type.VIDEO,
      id: 'PKLQhfZh',
      accountId: 'demo.straas.io-test',
      appToken: data.token,
    }

    const urlComponents = new URL(window.location.href);
    const mediaProps = Object.keys(mediaConfig);
    mediaProps.forEach(prop => {
      const value = urlComponents.searchParams.get(prop)
      value && (mediaConfig[prop] = value)
    })

    StraaS.setMediaConfig = function setMediaConfig(type: string, id: string, accountId: string, appToken: string) {
      urlComponents.searchParams.set('type', type || '')
      urlComponents.searchParams.set('id', id || '')
      urlComponents.searchParams.set('accountId', accountId || '')
      urlComponents.searchParams.set('appToken', appToken || '')

      window.location.href = `${urlComponents.toString()}`
    }

    const playerInstance = new Player(containingElementSelector, {
      type: mediaConfig.type,
      id: mediaConfig.id,
      accountId: mediaConfig.accountId,
      appToken: mediaConfig.appToken,
      controls: false,
      events: {
        canplay: () => {
          eventDispatcher.dispatchEvent(new Event('canplay'))
          if (mediaConfig.type === 'live') {
            eventDispatcher.dispatchEvent(new Event('isLive'))
          }
        },
        play: () => {
          eventDispatcher.dispatchEvent(new Event('play'))
        },
        playing: () => {
          eventDispatcher.dispatchEvent(new Event('playing'))
        },
        timeupdate: () => {
          eventDispatcher.dispatchEvent(new Event('timeUpdate'))
        },
        pause: () => {
          eventDispatcher.dispatchEvent(new Event('paused'))
        },
        fullscreenchange: (data: any) => {
        },
        levelmenurendered: () => {
          eventDispatcher.dispatchEvent(new Event('levelMenuRendered'))
        },
        levelchange: () => {
          eventDispatcher.dispatchEvent(new Event('levelChange'))
        },
        ratechange: () => {
          eventDispatcher.dispatchEvent(new Event('playbackSpeedChange'))
        },
        volumechange: () => {
          eventDispatcher.dispatchEvent(new Event('volumeChange'))
        }
      }
    })

    resolve(playerInstance)
  }

  return promise
}

export default async function initStraasPlayer(containingElementSelector: string, eventDispatcher: HTMLElement) {
  loadStraasPlayerJs()

  const playerInstance = await loadVideo(containingElementSelector, eventDispatcher)
  installEvents(playerInstance, eventDispatcher)

  return playerInstance
}
