import React from 'react'
import CachedIcon from '@material-ui/icons/Cached'

import BigButtonContainer from './BigButtonContainer'
import {
  makeStylesFromCollection,
  spinKeyFramesStyles
} from './BigButton.style'

const LoadingIcon = makeStylesFromCollection('style', 'position', 'spinKeyFrame', 'dropShadow')(CachedIcon)

const LoadingIconBox: React.FunctionComponent<{}> = () => {
  spinKeyFramesStyles()

  return (
    <BigButtonContainer>
        <LoadingIcon/>
    </BigButtonContainer>
  )
}

export default LoadingIconBox
