import util from 'util'
import fs from 'fs'
import YAML from 'yaml'
import path from 'path'
import glob from 'glob'
import { Config, Profiler, Project } from './types'

const ncp = util.promisify(require('ncp').ncp)

const templateFile = (fileName: string, replacements: Profiler) => {
  const fileContent = fs.readFileSync(fileName, 'utf8').toString()

  const template = Object.entries(replacements).reduce((acc, [key, value]) => {
    return acc.replace(
      new RegExp(`(\{\{${key}\}\}|\{\{ ${key} \}\})`, 'g'),
      value?.toString() ?? ''
    )
  }, fileContent)
  fs.writeFileSync(fileName, template)
}

// required for npm publish
const renameGitignore = (projectName: string) => {
  if (fs.existsSync(path.normalize(`${projectName}/gitignore`))) {
    fs.renameSync(
      path.normalize(`${projectName}/gitignore`),
      path.normalize(`${projectName}/.gitignore`)
    )
  }
}

const buildProfiler = ({
  type,
  framework,
  language,
  name,
  css,
  port,
}: Project) => {
  const profiler: Profiler = {
    NAME: name,
    FRAMEWORK: framework,
    SAFE_NAME: name.replace(/-/g, '_').trim(),
    LANGUAGE: language === 'typescript' ? 'TypeScript' : 'JavaScript',
  }

  if (type === 'API Server' || type === 'Application') {
    profiler.PORT = port
  }

  if (type === 'Application') {
    const isTailwind = css === 'Tailwind'
    profiler.CSS_EXTENSION = isTailwind ? 'scss' : 'css'
    profiler.CONTAINER = isTailwind
      ? 'mt-10 text-3xl mx-auto max-w-6xl'
      : 'container'
    profiler.CSS = isTailwind ? 'Tailwind' : 'Empty CSS'
  }
  return profiler
}

export const buildProject = async (project: Project) => {
  console.log(`Building ${project.name}`)

  const { language, name, framework, type } = project
  const lang = language === 'typescript' ? 'ts' : 'js'
  const tempDir = type.toLowerCase()
  const profiler = buildProfiler(project)
  switch (type) {
    case 'Library':
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/typescript`),
        project.name
      )
      break

    case 'API Server':
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/${framework}`),
        name
      )
      break
    case 'Application':
      {
        await ncp(
          path.join(__dirname, `../templates/${tempDir}/${framework}/base`),
          name
        )
        await ncp(
          path.join(__dirname, `../templates/${tempDir}/${framework}/${lang}`),
          name
        )

        if (profiler.CSS_EXTENSION === 'scss') {
          fs.unlinkSync(path.normalize(`${name}/src/index.css`))
          await ncp(
            path.join(__dirname, '../templates/application-extras/tailwind'),
            name
          )

          const packageJSON = JSON.parse(
            fs.readFileSync(path.join(name, 'package.json'), 'utf8')
          )
          packageJSON.devDependencies.tailwindcss = '^2.0.2'
          fs.writeFileSync(
            path.join(name, 'package.json'),
            JSON.stringify(packageJSON, null, 2)
          )
        }
      }
      break
  }
  renameGitignore(name)

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, profiler)
    }
  })
}

export const buildProjectWithConfig = async (configPath: string) => {
  const configFile = configPath
  const file = fs.readFileSync(configFile, 'utf8')
  const configs: Config = YAML.parse(file)

  const { apps, servers } = configs

  if (apps) {
    apps.map((app: any) => {
      const [name] = Object.keys(app)
      app[name].type = 'Application'
      app[name].name = name
      ;(async function () {
        const templates = fs
          .readdirSync(path.join(__dirname, '../templates/application'))
          .sort()

        const foundType = templates.find(
          (template) => template == app[name].framework
        )

        if (foundType) {
          buildProject(app[name])
        }
      })()
    })
  }

  if (servers) {
    servers.map((server: any) => {
      const [name] = Object.keys(server)
      server[name].type = 'API Server'
      server[name].name = name
      server[name].language = 'typescript'
      ;(async function () {
        const templates = fs
          .readdirSync(path.join(__dirname, '../templates/server'))
          .sort()

        const foundType = templates.find(
          (template) => template == server[name].framework
        )

        if (foundType) {
          buildProject(server[name])
        }
      })()
    })
  }
}
