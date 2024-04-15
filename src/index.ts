import util from 'util'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { Profiler, Project } from './types'

const ncp = util.promisify(require('ncp').ncp)

const templateFile = (fileName: string, replacements: Profiler) => {
  const fileContent = fs.readFileSync(fileName, 'utf8').toString()

  const template = Object.entries(replacements).reduce((acc, [key, value]) => {
    return acc.replace(
      new RegExp(`({{${key}}}|{{ ${key} }})`, 'g'),
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
  packer
}: Project) => {
  const profiler: Profiler = {
    NAME: name,
    FRAMEWORK: framework,
    SAFE_NAME: name.replace(/-/g, '_').trim(),
    LANGUAGE: language === 'typescript' ? 'TypeScript' : 'JavaScript',
    LANGEXT: language === 'typescript' ? 'ts' : 'js',
    PACKER: packer
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

// Options:
//   - type: "Application", "Library", "Server"
//   - name: Name of the project
//   - framework: Name of the framework
//   - language: Language of the project
//   - css: CSS framework
//   - port: Port to run the project on

export const buildProject = async (project: Project) => {
  const { language, name, framework, type } = project
  const lang = language === 'typescript' ? 'ts' : 'js'
  const tempDir = type.toLowerCase()
  const profiler = buildProfiler(project)

  let packageJSON: Record<string, any> = {
    devDependencies: {}
  }

  switch (type) {
    case 'Library':
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/typescript`),
        project.name
      )
      break

    case 'API Server':
      await ncp(path.join(__dirname, `../templates/server/${framework}`), name)
      break
    case 'Application':
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/${framework}/base`),
        name
      )
      await ncp(
        path.join(__dirname, `../templates/${tempDir}/${framework}/${lang}`),
        name
      )

      if (fs.existsSync(path.join(name, 'package.json'))) {
        packageJSON = JSON.parse(
          fs.readFileSync(path.join(name, 'package.json'), 'utf8')
        )
      } else {
        if (profiler.PACKER === 'Webpack') {
          packageJSON = JSON.parse(
            fs.readFileSync(path.join(name, 'package.webpack.json'), 'utf8')
          )
          fs.unlinkSync(path.join(name, 'rspack.config.js'))
        } else {
          packageJSON = JSON.parse(
            fs.readFileSync(path.join(name, 'package.rspack.json'), 'utf8')
          )
          fs.unlinkSync(path.join(name, 'webpack.config.js'))
        }
        fs.unlinkSync(path.join(name, 'package.rspack.json'))
        fs.unlinkSync(path.join(name, 'package.webpack.json'))
      }

      if (profiler.CSS_EXTENSION === 'scss') {
        fs.unlinkSync(path.normalize(`${name}/src/index.css`))
        await ncp(
          path.join(__dirname, '../templates/application-extras/tailwind'),
          name
        )

        packageJSON.devDependencies.tailwindcss = '^3.4.1'
      }
      fs.writeFileSync(
        path.join(name, 'package.json'),
        JSON.stringify(packageJSON, null, 2)
      )
      break
  }
  renameGitignore(name)

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, profiler)
    }
  })
}
