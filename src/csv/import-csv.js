import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const csvFile = fs.createReadStream(csvPath)

const parser = parse({ 
  delimiter: ',',
  from_line: 2,
})

const importCsv = async() => {
  const tasks = csvFile.pipe(parser)

  for await (const task of tasks) {
    const [ title, description ] = task
    
    await importRequest(title, description)
  }
}

const importRequest = async(title, description) => {
  await fetch('http://localhost:3333/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
    }),
    duplex: 'half'
  })
}

importCsv()