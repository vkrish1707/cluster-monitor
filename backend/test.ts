process.env.NODE_ENV = 'test'

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { configure, run, } from '@japa/runner'

sourceMapSupport.install({ handleUncaughtExceptions: false })

configure({
  files: ['tests/**/*.ts'],
  importer: (filePath) => import(filePath),
})

run()
