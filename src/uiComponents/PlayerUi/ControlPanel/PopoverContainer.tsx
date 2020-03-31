import React, { useState, useEffect } from 'react'
import Popover from '@material-ui/core/Popover'
import Container from '@material-ui/core/Container'

import { getClassesList, getMergedClassNames } from '../PlayerUi.styles'

interface ChildComponentRequiredProps {
  onMouseUp: () => void
}

interface PopoverSliderPublicProps {
  requestShowingSlider: HTMLElement | null
  length?: string
  popoverContainer?: React.Component | Element
}

interface PopoverSliderProps<P extends ChildComponentRequiredProps> extends PopoverSliderPublicProps {
  ChildComponent: React.FunctionComponent<P>
}

type InternalProps<P extends ChildComponentRequiredProps> = React.PropsWithChildren<PopoverSliderProps<P>> & P

type ExternalProps<P> = React.PropsWithChildren<PopoverSliderPublicProps> & Omit<P, 'onMouseUp'>

const PopoverSlider: React.FunctionComponent<InternalProps<any>> = function <P extends ChildComponentRequiredProps>(props: InternalProps<P>) {
  const { requestShowingSlider, length, ChildComponent, popoverContainer } = props
  const [sliderAnchor, setSliderAnchor] = useState<null | HTMLElement>(null)
  const [closeSliderTimeoutId, setCloseSliderTimeoutId] = useState(0)

  const popOverSize = getClassesList({
    size: {
      height: 'auto',
      width: length || '200px'
    },
    padding: {
      padding: '8px',
      margin: '0'
    }
  })

  const closeSlider = () => {
    setSliderAnchor(null)
  }

  const readyCloseSlider = () => {
    setCloseSliderTimeoutId(window.setTimeout(closeSlider, 200))
  }

  const clearCloseSliderTimer = () => {
    if (closeSliderTimeoutId) {
      window.clearTimeout(closeSliderTimeoutId)
      setCloseSliderTimeoutId(0)
    }
  }

  useEffect(() => {
    if (requestShowingSlider) {
      clearCloseSliderTimer()
      setSliderAnchor(requestShowingSlider)
    }
    else {
      readyCloseSlider()
    }
  }, [requestShowingSlider])

  return (
    <Popover
      anchorEl={sliderAnchor}
      open={!!sliderAnchor}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
      container={popoverContainer}>
      <Container
        className={getMergedClassNames('root', popOverSize)}
        onMouseEnter={clearCloseSliderTimer}
        onMouseLeave={readyCloseSlider}>
        <ChildComponent {...props} onMouseUp={readyCloseSlider}></ChildComponent>
      </Container>
    </Popover>
  )
}

export function wrapPopoverSlider<P extends ChildComponentRequiredProps>(childComponent: React.FunctionComponent<P>) {
  return function renderPopoverSlider<T extends ExternalProps<P>>(props: T) {
    return (
      <PopoverSlider
        ChildComponent={childComponent}
        {...props}
      >
      </PopoverSlider>
    )
  }
}

export default PopoverSlider
