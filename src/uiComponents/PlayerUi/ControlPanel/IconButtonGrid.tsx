import React from 'react'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

import { getIconButtonClasses, getMergedClassNames } from '../PlayerUi.styles'

interface IconButtonItem {
  Component: Function
  onClick: () => void
}

interface IconButtonGridProps {
  icons: IconButtonItem[]
  onMouseUp: () => void
}

const IconButtonGrid: React.FunctionComponent<IconButtonGridProps> = function (props: IconButtonGridProps) {
  const { icons, onMouseUp } = props

  const nodes: React.ReactNode[] = []
  const iconClasses = getIconButtonClasses('40px')
  const buttonClasses = getIconButtonClasses('48px')

  icons.forEach(({ Component, onClick }, index) => {
    nodes.push(
      <Grid item key={index}>
        <IconButton
          onClick={onClick}
          onMouseUp={onMouseUp}
          className={getMergedClassNames('root', buttonClasses)}>
          <Component className={getMergedClassNames('root', iconClasses)} />
        </IconButton>
      </Grid>
    )
  })

  return (
    <Grid container spacing={0}>
      {nodes}
    </Grid>
  )
}

export default IconButtonGrid



