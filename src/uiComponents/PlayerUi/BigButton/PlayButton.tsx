import React, { useState } from 'react'
import PlayIcon from '@material-ui/icons/PlayArrow'
import IconButton from '@material-ui/core/IconButton'

import BigButtonContainer from './BigButtonContainer'
import { defaultBigButtonStyle, defaultBigButtonPosition } from './BigButton.style'
import { getClassesList, getMergedClassNames } from '../PlayerUi.styles'

interface PlayButtonProps {
  play: () => void
  isPaused: boolean
}

const BigPlayButton = defaultBigButtonPosition(IconButton)

const BigPlayIcon = defaultBigButtonStyle(PlayIcon)

const PlayButton: React.FunctionComponent<PlayButtonProps> = (props) => {
  const [isHover, setHover] = useState(false)
  const classes = getClassesList({
    hover: { blur: isHover ? 0 : 3 },
    display: { display: props.isPaused ? 'block' : 'none' }
  })

  return (
    <BigButtonContainer>
      <BigPlayButton onClick={() => props.play()}>
        <BigPlayIcon
          className={getMergedClassNames('root', classes)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      </BigPlayButton>
    </BigButtonContainer>
  )
}

export default PlayButton
