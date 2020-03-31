import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import { getClassesList, getMergedClassNames } from '../PlayerUi.styles'

interface LevelButtonProps {
  levels: any[]
  currentLevel: any
  eventDispatcher: HTMLElement
  levelSwitching: boolean
}

const LevelButtons: React.FunctionComponent<LevelButtonProps> = function (props) {
  const buttonClasses = getClassesList({
    size: {
      height: '48px',
      width: 'auto'
    }
  })

  const { levels, currentLevel, eventDispatcher } = props
  const buttons: React.ReactElement[] = []
  levels.forEach(level => {
    const disabled = props.levelSwitching || (
      level.name === 'auto' ? currentLevel.auto : !currentLevel.auto && (level.label === currentLevel.label)
    )

    buttons.push(
      <Grid item key={level.label} xs="auto">
        <Button
          disabled={disabled}
          className={getMergedClassNames('root', buttonClasses)}
          onClick={() => {
            eventDispatcher.dispatchEvent(new CustomEvent('requestLevelChange', { detail: level })) }}>
          {level.label}
        </Button>
      </Grid>
    )
  })
  return (
    <React.Fragment>
      {buttons}
    </React.Fragment>
  )
}

export default LevelButtons
