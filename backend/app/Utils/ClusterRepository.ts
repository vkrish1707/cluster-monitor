import { promises as fs } from 'fs'
import path from 'path'

const isTestEnv = process.env.NODE_ENV === 'test'
const FILE_PATH = isTestEnv
  ? path.resolve(__dirname, '../../database/testData.json')
  : path.resolve(__dirname, '../../database/data.json')
export default class FileStorage {
  static async read() {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw)
  }

  static async write(data: any) {
    if (isTestEnv) return
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2))
  }
}