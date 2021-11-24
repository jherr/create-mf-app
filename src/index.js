const util = require('util')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const ncp = util.promisify(require('ncp').ncp)

const templateFile = (fileName, replacements) => {
  let contents = fs.readFileSync(fileName, 'utf8').toString()
  Object.keys(replacements).forEach((key) => {
    contents = contents.replace(
      new RegExp(`(\{\{${key}\}\}|\{\{ ${key} \}\})`, 'g'),
      replacements[key]
    )
  })
  fs.writeFileSync(fileName, contents)
}

// required for npm publish
const renameGitignore = (projectName) => {
  const projectPath = path.join(__dirname, projectName)
  fs.renameSync(`${projectPath}/gitignore`, `${projectPath}/.gitignore`)
}

// Options:
//   - type: "Application", "Library", "Server"
//   - name: Name of the project
//   - framework: Name of the framework
//   - language: Language of the project
//   - css: CSS framework
//   - port: Port to run the project on

module.exports = async ({ type, language, framework, name, css, port }) => {
  const lang = language === 'typescript' ? 'ts' : 'js'

  const replacements = {
    NAME: name,
    FRAMEWORK: framework,
    SAFE_NAME: name.replace(/-/g, '_').trim(),
    LANGUAGE: language === 'typescript' ? 'TypeScript' : 'JavaScript'
  }

  const tempDir = type.toLowerCase()

  if (type === 'Library') {
    await ncp(path.join(__dirname, `../templates/${tempDir}/typescript`), name)
  }

  if (type === 'Server') {
    replacements.PORT = port

    await ncp(
      path.join(__dirname, `../templates/${tempDir}/${framework}`),
      name
    )
  }

  if (type === 'Application') {
    await ncp(
      path.join(__dirname, `../templates/${tempDir}/${framework}/base`),
      name
    )
    await ncp(
      path.join(__dirname, `../templates/${tempDir}/${framework}/${lang}`),
      name
    )

    const tailwind = css === 'Tailwind'
    replacements.CSS_EXTENSION = tailwind ? 'scss' : 'css'
    replacements.CONTAINER = tailwind
      ? 'mt-10 text-3xl mx-auto max-w-6xl'
      : 'container'
    replacements.CSS = tailwind ? 'Tailwind' : 'Empty CSS'
    replacements.PORT = port

    if (tailwind) {
      fs.unlinkSync(path.join(name, '/src/index.css'))

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

  renameGitignore(name)

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, replacements)
    }
  })
}
