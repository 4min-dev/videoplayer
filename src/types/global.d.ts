declare module '*.module.scss' {
    const classes: { [key: string]: string }
    export default classes
  }
  
  declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
  }
  
  declare module '*.png' {
    const content: string
    export default content
  }
  
  declare module '*.jpg' {
    const content: string
    export default content
  }
  
  declare module '*.jpeg' {
    const content: string
    export default content
  }
  
  declare module '*.gif' {
    const content: string
    export default content
  }
  
  declare module '*.svg' {
    import React = require('react')
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    export default content
  }
  
  declare module '*.webp' {
    const content: string
    export default content
  }
  
  declare module '*.ico' {
    const content: string
    export default content
  }
  
  declare module '*.woff' {
    const content: string
    export default content
  }
  
  declare module '*.woff2' {
    const content: string
    export default content
  }
  
  declare module '*.ttf' {
    const content: string
    export default content
  }
  
  declare module '*.eot' {
    const content: string
    export default content
  }
  
  declare module '*.json' {
    const value: any
    export default value
  }