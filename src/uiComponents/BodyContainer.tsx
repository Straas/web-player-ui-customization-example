import { withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import React from 'react'
import propTypes from 'prop-types'

interface BodyContainerProps {
  className?: string
  onMouseMove?: (event: any) => void
  onClick?: () => void
}

const StyledContainer = withStyles({
  root: {
    height: '100%',
    padding: '0',
    margin: '0',
    position: 'relative'
  }
})(Container)

const BodyContainer: React.FunctionComponent<BodyContainerProps> = (props) => {
  const { children, className, onMouseMove, onClick } = props
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledContainer className={className} maxWidth="xl" onMouseMove={onMouseMove} onClick={onClick}>
        {children}
      </StyledContainer>
    </React.Fragment>
  )
}

BodyContainer.propTypes = {
  className: propTypes.string
}

export default BodyContainer
