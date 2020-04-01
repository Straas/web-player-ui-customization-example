import React from 'react'
import Panel from './Panel'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import PauseIcon from '@material-ui/icons/Pause'
import PlayIcon from '@material-ui/icons/PlayArrow'
import IconButton from '@material-ui/core/IconButton'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import { withStyles } from '@material-ui/core/styles'

import { getMergedClassNames, getIconButtonClasses, getIconClasses } from '../PlayerUi.styles'
import LevelButtons from './LevelButtons'
import PlaybackSpeedSlider from './PlaybackSpeedSlider'
import VolumeSlider from './VolumeSlider'
import Forward from './Forward'
import Replay from './Replay'

interface ControlPanelProps {
  showControlPanel: boolean
  duration: number
  currentTime: number
  eventDispatcher: HTMLElement
  isPlaying: boolean
  isFullscreen: boolean
  levels: any[]
  currentLevel: object
  levelSwitching: boolean
  playbackSpeed: number
  volume: number
  muted: boolean
  isLive: boolean
}

function formatTimeToHms(value: number, index: number): string {
  const currentTime = Math.floor(value)
  const hours = Math.floor(currentTime / 3600)
  const minutes = String(Math.floor((currentTime % 3600) / 60)).padStart(2, '0')
  const seconds = String((currentTime % 3600) % 60).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

const ControlPanel: React.FunctionComponent<ControlPanelProps> = function (props) {
  const {
    eventDispatcher,
    isPlaying,
    isFullscreen,
    levels,
    currentLevel,
    levelSwitching,
    playbackSpeed,
    volume,
    muted,
    showControlPanel,
    duration,
    isLive,
    currentTime
  } = props

  const iconButtonClasses = getIconButtonClasses()
  const iconClasses = getIconClasses()

  const valueLabelPosition: any = {}

  if (currentTime < 5) {
    valueLabelPosition.left = '0'
  }
  else if (duration - currentTime < 5) {
    valueLabelPosition.right = '0'
  }
  else {
    valueLabelPosition.left = 'calc(-45px + 50%)'
  }

  const VideoSlider = withStyles({
    root: {
      height: 8
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus,&:hover,&$active': {
        boxShadow: 'inherit'
      }
    },
    active: {},
    valueLabel: Object.assign({
      transition: 'initial',
      overflow: 'hidden',
      '& > span': {
        width: '90px',
        borderRadius: '4px',
        transform: 'rotate(0deg)'
      },
      '& > span > span': {
        transform: 'rotate(0deg)'
      }
    }, valueLabelPosition),
    track: {
      height: 8,
      borderRadius: 4
    },
    rail: {
      height: 8,
      borderRadius: 4
    },
  })(Slider)

  return (
    <React.Fragment>
      <Panel
        panelType="column"
        showPanel={showControlPanel}>
        <Grid container direction="column" spacing={0} alignContent="flex-start" alignItems="center">
          <Grid item xs="auto">
            <IconButton
              className={getMergedClassNames('root', iconButtonClasses)}
              onClick={() => eventDispatcher.dispatchEvent(new Event(isPlaying ? 'requestPause' : 'requestPlay'))}>
              {!isPlaying ?
                <PlayIcon className={getMergedClassNames('root', iconClasses)} /> :
                <PauseIcon className={getMergedClassNames('root', iconClasses)} />}
            </IconButton>
          </Grid>
          <Grid item xs="auto">
            <IconButton
              className={getMergedClassNames('root', iconButtonClasses)}
              onClick={() => eventDispatcher.dispatchEvent(new Event(isFullscreen ? 'requestExitFullscreen' : 'requestFullscreen'))}>
              {!isFullscreen ?
                <FullscreenIcon className={getMergedClassNames('root', iconClasses)} /> :
                <FullscreenExitIcon className={getMergedClassNames('root', iconClasses)} />}
            </IconButton>
          </Grid>
          <Grid item xs="auto">
          </Grid>
          {!isLive ? <PlaybackSpeedSlider eventDispatcher={eventDispatcher} playbackSpeed={playbackSpeed} /> : null}
          <VolumeSlider eventDispatcher={eventDispatcher} volume={volume} muted={muted} />
          {!isLive ? <Forward eventDispatcher={eventDispatcher} /> : null}
          {!isLive ? <Replay eventDispatcher={eventDispatcher} /> : null}
          {LevelButtons({ levels, currentLevel, eventDispatcher, levelSwitching })}
        </Grid>
      </Panel>
      <Panel
        showPanel={showControlPanel && !!duration}>
        <Grid container direction="row" spacing={0} alignContent="flex-start" alignItems="stretch">
          <Grid item xs={12}>
            <VideoSlider
              min={0}
              max={duration}
              defaultValue={0}
              step={1}
              valueLabelDisplay="auto"
              value={currentTime}
              valueLabelFormat={formatTimeToHms}
              onChange={(event, value) => eventDispatcher.dispatchEvent(new CustomEvent('requestSeek', { detail: value }))}
            />
          </Grid>
        </Grid>
      </Panel>
    </React.Fragment>
  )
}

export default ControlPanel
