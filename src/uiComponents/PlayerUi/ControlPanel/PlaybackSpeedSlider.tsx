import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import SignalCellular1BarIcon from '@material-ui/icons/SignalCellular1Bar'
import SignalCellular2BarIcon from '@material-ui/icons/SignalCellular2Bar'
import SignalCellular3BarIcon from '@material-ui/icons/SignalCellular3Bar'
import SignalCellular4BarIcon from '@material-ui/icons/SignalCellular4Bar'

import { wrapPopoverSlider } from './PopoverContainer'
import SliderGrid from './SliderGrid'

import { getMergedClassNames, getIconButtonClasses, getIconClasses } from '../PlayerUi.styles'

const Slider = wrapPopoverSlider(SliderGrid)

interface PlaybackSpeedMenuProps {
  playbackSpeed: number
  eventDispatcher: HTMLElement
}

interface SpeedMarkElement {
  speed: number
  icon: (arg: any) => JSX.Element
}

type SpeedMarks = SpeedMarkElement[]

const speedMarks: SpeedMarks = [
  { speed: 0.25, icon: SignalCellular1BarIcon },
  { speed: 0.5, icon: SignalCellular1BarIcon },
  { speed: 1, icon: SignalCellular2BarIcon },
  { speed: 1.25, icon: SignalCellular3BarIcon },
  { speed: 1.75, icon: SignalCellular3BarIcon },
  { speed: 2, icon: SignalCellular4BarIcon }
]

const PlaybackSpeedMenu: React.FunctionComponent<PlaybackSpeedMenuProps> = function (props) {
  const [showSlider, setShowSlider] = useState<HTMLElement | null>(null)
  const { playbackSpeed, eventDispatcher } = props

  const changePlaybackSpeed = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    eventDispatcher.dispatchEvent(new CustomEvent('requestPlaybackSpeed', { detail: (value as number) }))
  }

  const toggleSpeed = () => {
    const foundIndex = speedMarks.findIndex(item => item.speed >= playbackSpeed)
    const nextIndex = (foundIndex + 1) % speedMarks.length
    eventDispatcher.dispatchEvent(new CustomEvent('requestPlaybackSpeed', { detail: speedMarks[nextIndex].speed }))
  }

  const foundElement = speedMarks.find(item => item.speed >= playbackSpeed)
  const SpeedIcon = foundElement ? foundElement.icon : SignalCellular2BarIcon

  const iconButtonClasses = getIconButtonClasses()
  const iconClasses = getIconClasses()

  const sliderMarks = speedMarks.map(item => ({ value: item.speed, label: `${item.speed}x` }))

  return (
    <React.Fragment>
      <IconButton
        className={getMergedClassNames('root', iconButtonClasses)}
        onMouseEnter={(e) => setShowSlider(e.currentTarget)}
        onMouseLeave={() => setShowSlider(null)}
        onClick={toggleSpeed}>
        <SpeedIcon className={getMergedClassNames('root', iconClasses)} />
      </IconButton>
      <Slider
        SmallAmountIcon={SignalCellular1BarIcon}
        LargeAmountIcon={SignalCellular4BarIcon}
        min={0.1}
        max={2}
        step={0.25}
        value={playbackSpeed}
        onChange={changePlaybackSpeed}
        requestShowingSlider={showSlider}
        marks={sliderMarks}
        length="350px"
        popoverContainer={eventDispatcher}
      />
    </React.Fragment>
  )
}

export default PlaybackSpeedMenu
