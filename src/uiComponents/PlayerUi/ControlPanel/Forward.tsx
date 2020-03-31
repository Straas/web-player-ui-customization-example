import React, { useState } from 'react'

import IconButton from '@material-ui/core/IconButton'
import Forward5Icon from '@material-ui/icons/Forward5'
import Forward10Icon from '@material-ui/icons/Forward10'
import Forward30Icon from '@material-ui/icons/Forward30'

import { wrapPopoverSlider } from './PopoverContainer'
import IconButtonGrid from './IconButtonGrid'
import { getMergedClassNames, getIconButtonClasses, getIconClasses } from '../PlayerUi.styles'
import { SvgIconProps } from '@material-ui/core'

interface ForwardProps {
  eventDispatcher: HTMLElement
}

type IconType = (props: SvgIconProps) => JSX.Element

const IconButtonList = wrapPopoverSlider(IconButtonGrid)

const Forward: React.FunctionComponent<ForwardProps> = function (props) {
  const [showIcons, setShowIcons] = useState<HTMLElement | null>(null)
  const [currentForwardSecond, setCurrentForwardSecond] = useState(5)
  const [MainIcon, setMainIcon] = useState<IconType>(Forward5Icon)

  const { eventDispatcher } = props

  const iconButtonClasses = getIconButtonClasses()
  const iconClasses = getIconClasses()

  const forwardHandler = (forwardSeconds: number, icon: IconType) => {
    quickForward(forwardSeconds)
    setMainIcon(icon)
    setCurrentForwardSecond(forwardSeconds)
  }

  const quickForward = (forwardSeconds: number) => {
    eventDispatcher.dispatchEvent(new CustomEvent('requestForward', { detail: forwardSeconds }))
  }

  return (
    <React.Fragment>
      <IconButton
        className={getMergedClassNames('root', iconButtonClasses)}
        onMouseEnter={(e) => setShowIcons(e.currentTarget)}
        onMouseLeave={() => setShowIcons(null)}
        onClick={() => quickForward(currentForwardSecond)}>
        <MainIcon className={getMergedClassNames('root', iconClasses)} />
      </IconButton>
      <IconButtonList
        requestShowingSlider={showIcons}
        icons={[
          { Component: Forward5Icon, onClick: () => { forwardHandler(5, Forward5Icon) } },
          { Component: Forward10Icon, onClick: () => { forwardHandler(10, Forward10Icon) } },
          { Component: Forward30Icon, onClick: () => { forwardHandler(30, Forward30Icon) } }
        ]}
        popoverContainer={eventDispatcher}
        length='auto'
      />
    </React.Fragment>
  )
}

export default Forward
