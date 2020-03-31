import React, { useState } from 'react'

import IconButton from '@material-ui/core/IconButton'
import Replay5Icon from '@material-ui/icons/Replay5'
import Replay10Icon from '@material-ui/icons/Replay10'
import Replay30Icon from '@material-ui/icons/Replay30'

import { wrapPopoverSlider } from './PopoverContainer'
import IconButtonGrid from './IconButtonGrid'
import { getMergedClassNames, getIconButtonClasses, getIconClasses } from '../PlayerUi.styles'
import { SvgIconProps } from '@material-ui/core'

interface ReplayProps {
  eventDispatcher: HTMLElement
}

type IconType = (props: SvgIconProps) => JSX.Element

const IconButtonList = wrapPopoverSlider(IconButtonGrid)

const Replay: React.FunctionComponent<ReplayProps> = function (props) {
  const [showIcons, setShowIcons] = useState<HTMLElement | null>(null)
  const [currentReplaySecond, setCurrentReplaySecond] = useState(5)
  const [MainIcon, setMainIcon] = useState<IconType>(Replay5Icon)

  const { eventDispatcher } = props

  const iconButtonClasses = getIconButtonClasses()
  const iconClasses = getIconClasses()

  const replayHandler = (replaySeconds: number, icon: IconType) => {
    quickReplay(replaySeconds)
    setMainIcon(icon)
    setCurrentReplaySecond(replaySeconds)
  }

  const quickReplay = (replaySeconds: number) => {
    eventDispatcher.dispatchEvent(new CustomEvent('requestReplay', { detail: replaySeconds }))
  }

  return (
    <React.Fragment>
      <IconButton
        className={getMergedClassNames('root', iconButtonClasses)}
        onMouseEnter={(e) => setShowIcons(e.currentTarget)}
        onMouseLeave={() => setShowIcons(null)}
        onClick={() => quickReplay(currentReplaySecond)}>
        <MainIcon className={getMergedClassNames('root', iconClasses)} />
      </IconButton>
      <IconButtonList
        requestShowingSlider={showIcons}
        icons={[
          { Component: Replay5Icon, onClick: () => { replayHandler(5, Replay5Icon) } },
          { Component: Replay10Icon, onClick: () => { replayHandler(10, Replay10Icon) } },
          { Component: Replay30Icon, onClick: () => { replayHandler(30, Replay30Icon) } }
        ]}
        popoverContainer={eventDispatcher}
        length='auto'
      />
    </React.Fragment>
  )
}

export default Replay
