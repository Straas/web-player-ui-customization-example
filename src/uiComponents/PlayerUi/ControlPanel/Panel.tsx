import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { getClassesList, getMergedClassNames } from '../PlayerUi.styles'

interface PanelProps {
  showPanel: boolean
  panelType?: 'row' | 'column'
  onMouseEnter?: (arg: any) => void
  onMouseLeave?: (arg: any) => void
}

const RowGrid = withStyles({
  root: {
    zIndex: 1502,
    position: 'absolute',
    bottom: '6px',
    borderRadius: '8px',
    padding: '0px 16px',
    left: '10px',
    right: '10px',
    width: 'auto',
    background: 'hsla(50, 100%, 100%, 0.6)'
  }
})(Grid)

const ColumnGrid = withStyles({
  root: {
    zIndex: 1502,
    position: 'absolute',
    borderRadius: '8px',
    padding: '4px',
    right: '10px',
    top: '15%',
    bottom: '51px',
    width: 'auto',
    background: 'hsla(50, 100%, 100%, 0.6)'
  }
})(Grid)

export default function Panel(props: React.PropsWithChildren<PanelProps>) {
  const { showPanel, panelType, onMouseEnter, onMouseLeave } = props

  const classes = getClassesList({
    display: {
      display: props.showPanel ? 'block' : 'none'
    }
  })

  const CurrentGrid = panelType === 'column' ? ColumnGrid : RowGrid

  return (
    <CurrentGrid
      container={showPanel}
      className={getMergedClassNames('root', classes)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      {props.children}
    </CurrentGrid>
  )
}

