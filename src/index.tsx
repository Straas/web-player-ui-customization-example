import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom'

import BodyContainer from './uiComponents/BodyContainer'
import PlayButton from './uiComponents/PlayerUi/BigButton/PlayButton'
import LoadingIcon from './uiComponents/PlayerUi/BigButton/LoadingIcon'

import initStraasPlayer from './straasPlayer'
import ControlPanel from './uiComponents/PlayerUi/ControlPanel/ControlPanel'

const eventDispatcher: HTMLElement = document.getElementById('app-container')!

function triggerPlay(eventDispatcher: HTMLElement, stateSetter: React.Dispatch<React.SetStateAction<boolean>>) {
  eventDispatcher.dispatchEvent(new Event('requestPlay'))
  stateSetter(true)
}

type IndexableObject = {
  [index: string]: any
}

function initShowControlPanelFunction() {
  let isShowControlPanel: boolean = false
  let setShowControlPanel: React.Dispatch<React.SetStateAction<boolean>> = () => { }
  const debouncedHideControl = _.debounce(function hideControl() {
    if (isShowControlPanel) {
      setShowControlPanel(!isShowControlPanel)
    }
  }, 5000)

  return _.throttle(function showControl(
    localIsShowControlPanel: boolean,
    localSetShowControlPanel: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    isShowControlPanel = localIsShowControlPanel
    setShowControlPanel = localSetShowControlPanel
    if (isShowControlPanel) {
      debouncedHideControl()
    }
    else {
      setShowControlPanel(!isShowControlPanel)
    }
  }, 1000, { leading: true })
}

const showControlFunction = initShowControlPanelFunction()

const App = () => {
  const className = 'body-container'
  const [isPlayerReady, setPlayerReady] = useState(false)
  const [isShowControlPanel, setShowControlPanel] = useState(true)
  const [isPlayInited, setPlayInited] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isPlaying, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setFullscreen] = useState(false)
  const [levels, setLevels] = useState([])
  const [currentLevel, setCurrentLevel] = useState({})
  const [duration, setDuration] = useState(0)
  const [levelSwitching, setLevelSwitching] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(0)
  const [volume, setVolume] = useState(0)
  const [muted, setMuted] = useState(false)
  const [playerInstance, setPlayerInstance] = useState<IndexableObject | null>(null)

  eventDispatcher.addEventListener('canplay', () => {
    setPlayerReady(true)
  })

  eventDispatcher.addEventListener('play', () => {
    setPlaying(true)
  })

  eventDispatcher.addEventListener('paused', () => {
    setPlaying(false)
  })

  document.body.addEventListener('fullscreenchange', () => {
    setFullscreen(!!document.fullscreenElement)
  })

  eventDispatcher.addEventListener('timeUpdate', () => {
    if (playerInstance) {
      setCurrentTime(playerInstance.currentTime)
      setDuration(_.isFinite(playerInstance.duration) ? playerInstance.duration : 0)
    }
  })

  eventDispatcher.addEventListener('levelMenuRendered', () => {
    if (playerInstance) {
      setLevels(playerInstance.levels)
    }
  })

  eventDispatcher.addEventListener('levelChange', () => {
    if (playerInstance) {
      setCurrentLevel(playerInstance.level)
    }

    setLevelSwitching(false)
  })

  eventDispatcher.addEventListener('requestLevelChange', () => {
    setLevelSwitching(true)
  })

  eventDispatcher.addEventListener('playing', () => {
    playerInstance && setPlaybackSpeed(playerInstance.playbackSpeed)
  })

  eventDispatcher.addEventListener('playbackSpeedChange', () => {
    playerInstance && setPlaybackSpeed(playerInstance.playbackSpeed)
  })

  eventDispatcher.addEventListener('volumeChange', () => {
    playerInstance && setVolume(playerInstance.volume)
    playerInstance && setMuted(playerInstance.muted)
  })

  useEffect(() => {
    (async () => {
      if (!isPlayInited) {
        setPlayInited(true)
        setPlayerInstance(await initStraasPlayer(`.${className}`, eventDispatcher))
      }
    })()
  })

  return (
    <BodyContainer onMouseMove={() => { showControlFunction(isShowControlPanel, setShowControlPanel) }}>
      <BodyContainer>
        <div style={{ width: '100%', height: '100%' }} className={className} />
      </BodyContainer>
      {isPlayerReady ? <PlayButton
        isPaused={!hasPlayed || !isPlaying}
        play={() => triggerPlay(eventDispatcher, setHasPlayed)} /> :
        <LoadingIcon />}
      {playerInstance ?
        <ControlPanel
          showControlPanel={hasPlayed && isShowControlPanel}
          duration={duration}
          currentTime={currentTime}
          eventDispatcher={eventDispatcher}
          isPlaying={isPlaying}
          isFullscreen={isFullscreen}
          levels={levels}
          currentLevel={currentLevel}
          levelSwitching={levelSwitching}
          playbackSpeed={playbackSpeed}
          volume={volume}
          muted={muted}
        /> : null}
    </BodyContainer >
  )
}

ReactDOM.render(<App />, eventDispatcher)

