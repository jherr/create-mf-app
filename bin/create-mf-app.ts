#!/usr/bin/env node
import inquirer from 'inquirer'
import shell from 'shelljs'
import * as yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import { buildProject, buildProjectWithConfig } from '../src/index'
import { Project } from '../src/types'

let args: any = yargs.option('path', {
  alias: 'p',
  demand: false,
}).argv

if (args.path) {
  buildProjectWithConfig(args.path)
} else {
  ;(async function () {
    const answers = await inquirer.prompt<Project>([
      {
        type: 'input',
        message: 'Pick the name of your app:',
        name: 'name',
        default: 'host',
      },
      {
        type: 'list',
        message: 'Project Type:',
        name: 'type',
        choices: ['Application', 'API Server', 'Library'],
        default: 'Application',
      },
    ])

    if (answers.type === 'Library') {
      buildProject(answers)
    }

    if (answers.type === 'API Server') {
      const templates = fs
        .readdirSync(path.join(__dirname, '../templates/server'))
        .sort()

      const serverAnswers = await inquirer.prompt<Project>([
        {
          type: 'input',
          message: 'Port number:',
          name: 'port',
          default: '8080',
        },
        {
          type: 'list',
          message: 'Template:',
          name: 'framework',
          choices: templates,
          default: 'express',
        },
      ])

      buildProject({
        ...answers,
        ...serverAnswers,
        language: 'typescript',
      })
    }

    if (answers.type === 'Application') {
      const templates = fs
        .readdirSync(path.join(__dirname, '../templates/application'))
        .sort()

      const appAnswers = await inquirer.prompt<Project>([
        {
          type: 'input',
          message: 'Port number:',
          name: 'port',
          default: '8080',
        },
        {
          type: 'list',
          message: 'Framework:',
          name: 'framework',
          choices: templates,
          default: 'react',
        },
        {
          type: 'list',
          message: 'Language:',
          name: 'language',
          choices: ['typescript', 'javascript'],
          default: 'javascript',
        },
        {
          type: 'list',
          message: 'CSS:',
          name: 'css',
          choices: ['CSS', 'Tailwind'],
          default: 'CSS',
        },
      ])

      buildProject({
        ...answers,
        ...appAnswers,
      })
    }

    shell.echo(`Your '${answers.name}' project is ready to go.

Next steps:

▶️ cd ${answers.name}
▶️ npm install
▶️ npm start
`)
  })()
}
