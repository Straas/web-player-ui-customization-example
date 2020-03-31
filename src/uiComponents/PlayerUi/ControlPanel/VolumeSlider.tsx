import React, {useState} from 'react'

import IconButton from '@material-ui/core/IconButton'
import VolumeDown from '@material-ui/icons/VolumeDown'
import VolumeUp from '@material-ui/icons/VolumeUp'
import VolumeMute from '@material-ui/icons/VolumeMute'

import { wrapPopoverSlider } from './PopoverContainer'
import SliderGrid from './SliderGrid'
import { getMergedClassNames, getIconButtonClasses, getIconClasses } from '../PlayerUi.styles'

interface VolumeProps {
  volume: number
  muted: boolean
  eventDispatcher: HTMLElement
}

const Slider = wrapPopoverSlider(SliderGrid)

const VolumeSlider: React.FunctionComponent<VolumeProps> = function (props) {
  const { volume, eventDispatcher, muted } = props

  const iconButtonClasses = getIconButtonClasses()
  const iconClasses = getIconClasses()

  const VolumeIcon = muted ? VolumeMute : volume > 0.5 ? VolumeUp : volume > 0 ? VolumeDown : VolumeMute

  const changeVolume = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    const volume = (value as number) / 100
    eventDispatcher.dispatchEvent(new CustomEvent('requestVolume', { detail: volume }))
  }

  const toggleMute = () => {
    eventDispatcher.dispatchEvent(new CustomEvent('requestMute', { detail: !muted }))
  }

  const [showSlider, setShowSlider] = useState<HTMLElement | null>(null)

  return (
    <React.Fragment>
      <IconButton
        className={getMergedClassNames('root', iconButtonClasses)}
        onMouseEnter={(e) => setShowSlider(e.currentTarget)}
        onMouseLeave={() => setShowSlider(null)}
        onClick={toggleMute}>
        <VolumeIcon className={getMergedClassNames('root', iconClasses)} />
      </IconButton>
      <Slider
        SmallAmountIcon={VolumeDown}
        LargeAmountIcon={VolumeUp}
        min={0}
        max={100}
        step={1}
        value={Math.floor(volume * 100)}
        onChange={changeVolume}
        requestShowingSlider={showSlider}
        popoverContainer={eventDispatcher}
      >
      </Slider>
    </React.Fragment>
  )
}

export default VolumeSlider
