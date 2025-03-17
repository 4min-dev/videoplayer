declare namespace NodeJS {
    interface Require {
      context(
        directory: string,
        useSubdirectories?: boolean,
        regExp?: RegExp
      ): __WebpackModuleApi.RequireContext
    }
  }
  
  declare namespace __WebpackModuleApi {
    interface RequireContext {
      (id: string): any
      keys(): string[]
    }
  }