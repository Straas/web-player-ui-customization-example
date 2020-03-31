import { withStyles, makeStyles, StyleRules } from '@material-ui/core/styles'
import _ from 'lodash'

interface BigButtonCssCollection {
  style: StyleRules
  position: StyleRules
  spinKeyFrame: StyleRules
  dropShadow: StyleRules
}

type BigButtonCssCollectionNames = keyof BigButtonCssCollection

const bigButtonCssCollection: BigButtonCssCollection = {
  style: {
    root: {
      width: '256px',
      height: '256px',
      color: 'white'
    }
  },
  position: {
    root: {
      position: 'absolute',
      top: 'calc(50% - 128px)',
      left: 'calc(50% - 128px)',
    }
  },
  spinKeyFrame: {
    root: {
      animation: 'spin 1s linear infinite'
    }
  },
  dropShadow: {
    root: {
      filter: 'drop-shadow(0px 0px 10px #000)'
    }
  }
}

export const defaultBigButtonStyle = withStyles(bigButtonCssCollection.style)

export const defaultBigButtonPosition = withStyles(bigButtonCssCollection.position)

export const spinAnimation = withStyles(bigButtonCssCollection.spinKeyFrame)

export function makeStylesFromCollection(...args: BigButtonCssCollectionNames[]) {
  const result: StyleRules = {}
  args.forEach(name => {
    _.merge(result, bigButtonCssCollection[name])
  })

  return withStyles(result)
}

export const spinKeyFramesStyles = makeStyles({
  '@global': {
    '@keyframes spin': {
      from: {
        transform: 'rotateZ(360deg)'
      },
      to: {
        transform: 'rotateZ(0)'
      }
    }
  }
})
