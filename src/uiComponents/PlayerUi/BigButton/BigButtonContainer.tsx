import React from 'react'
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/core/styles'

const StyledContainer = withStyles({
  root: {
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: '0%',
    right: '0%',
    width: 'auto',
    bottom: 0
  },
})(Container)

const BigButtonContainer: React.FunctionComponent<React.PropsWithChildren<{}>> = (props) => {
  return (
    <StyledContainer maxWidth={false}>
      {props.children}
    </StyledContainer>
  )
}

export default BigButtonContainer
