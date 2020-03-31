import { withStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import _ from 'lodash'

interface HoverStyle {
  blur: number
}

interface DisplayStyle {
  display: 'none' | 'block' | 'inline-block'
}

interface PaddingStyle {
  padding: string
  margin: string
}

interface SizeStyle {
  height: string
  width: string
}

interface PositionStyle {
  position: 'absolute' | 'relative'
  left: string
  top: string
  bottom: string
  right: string
}

interface StylePropsList {
  hover: HoverStyle
  display: DisplayStyle
  padding: PaddingStyle
  size: SizeStyle
  position: PositionStyle
}

interface Classes {
  [index: string]: string
}

interface ClassesList {
  [index: string]: string[]
}

type StyleRulesFunctionList = {
  [P in keyof StylePropsList]: (props: StylePropsList[P]) => Classes
}

type StylePropsListKeys = keyof StylePropsList

type OptionalStylePropsList = {
  [P in keyof StylePropsList]+?: StylePropsList[P]
}

type StyleFunctionWithAnyProps = (props: any) => Classes

export const hoverStyle = makeStyles({
  root: (props: HoverStyle) => ({
    filter: `blur(${props.blur}px) drop-shadow(2px 2px 10px #FFF)`
  })
})

export const displayStyle = makeStyles({
  root: ({ display }: DisplayStyle) => ({ display })
})

export const paddingStyle = makeStyles({
  root: ({ padding, margin }: PaddingStyle) => ({ padding, margin })
})

export const sizeStyle = makeStyles({
  root: ({ width, height }: SizeStyle) => ({ width, height })
})

export const positionStyle = makeStyles({
  root: ({ position, left, top, right, bottom }: PositionStyle) => ({ position, left, top, right, bottom })
})


const styleRulesFunctionList: StyleRulesFunctionList = {
  hover: hoverStyle,
  display: displayStyle,
  padding: paddingStyle,
  size: sizeStyle,
  position: positionStyle
}

export const getIconButtonClasses = (size: string = '48px') =>
  getClassesList({
    padding: {
      padding: '0',
      margin: '0'
    },
    size: {
      height: size,
      width: size
    }
  })

export const getIconClasses = () =>
  getClassesList({
    size: {
      height: '40px',
      width: '40px'
    }
  })

export function getClassesList(styles: OptionalStylePropsList) {
  const keys: StylePropsListKeys[] = Object.keys(styles) as StylePropsListKeys[]
  const classesList: ClassesList = {}

  keys.forEach(name => {
    const classes = (styleRulesFunctionList[name] as StyleFunctionWithAnyProps)(styles[name])
    Object.keys(classes).forEach(className => {
      classesList[className] = (classesList[className] || []).concat(classes[className])
    })
  })

  return classesList
}

export function getMergedClassNames<O extends ClassesList, N extends keyof O>(name: N, classesList: O) {
  if (_.isUndefined(classesList[name])) {
    return ''
  }

  return clsx(...classesList[name])
}
