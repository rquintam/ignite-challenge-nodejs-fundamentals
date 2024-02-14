import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body

      if (typeof title === 'undefined' || typeof description === 'undefined') {
        return response.writeHead(400).end()
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      database.insert('tasks', task)

      return response.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return response.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const { title, description } = request.body

      if (typeof title === 'undefined' || typeof description === 'undefined') {
        return response.writeHead(400).end()
      }

      if (!database.exist('tasks', id)) return response.writeHead(400).end()

      database.update('tasks', id, {
        title,
        description,
      })

      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params

      if (!database.exist('tasks', id)) return response.writeHead(400).end()
      
      database.delete('tasks', id)

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params

      if (!database.exist('tasks', id)) return response.writeHead(400).end()

      database.complete('tasks', id)
            
      return response.writeHead(204).end()
    }
  },
]

/* ROTAS DO DESAFIO
  - Criação task
  - Listagem tasks
  - Atualização task pelo 'id'
  - Remover task pelo 'id'
  - Marcar pelo 'id' task como completa
  - Importação tasks em massa via CSV
*/