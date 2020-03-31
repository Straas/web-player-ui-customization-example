import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Slider, { Mark } from '@material-ui/core/Slider'

interface SliderGridProps {
  SmallAmountIcon: Function
  LargeAmountIcon: Function
  value: number
  min: number
  max: number
  step: number
  onChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void
  onMouseUp: () => void
  marks?: Mark[]
  length?: string
}

const SliderGrid: React.FunctionComponent<SliderGridProps> = function (props: SliderGridProps) {
  const {
    SmallAmountIcon,
    LargeAmountIcon,
    min,
    max,
    value,
    onChange,
    step,
    marks,
    onMouseUp
  } = props

  return (
    <Grid container spacing={2}>
      <Grid item>
        <SmallAmountIcon />
      </Grid>
      <Grid item xs>
        <Slider
          min={min}
          max={max}
          value={value}
          step={step}
          valueLabelDisplay="auto"
          onMouseUp={onMouseUp}
          onChange={onChange}
          marks={marks || false}
        />
      </Grid>
      <Grid item>
        <LargeAmountIcon />
      </Grid>
    </Grid>
  )
}

export default SliderGrid
