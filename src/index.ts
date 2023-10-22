import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import compareplayer from './compareplayer'
import home from './home'
import playerinformation from './playerinformation'
import playerprediction from './playerprediction'
import playerranking from './playerranking'
import showsimilarplayers from './showsimilarplayers'
import teamranking from './teamranking'
import timeformatch from './timeformatch'

const app = new Hono()
app.use('*', cors())

app.get('/', (c) => c.text('Hello Hono!'))

app.route('/compareplayer', compareplayer)
app.route('/home', home)
app.route('/playerinformation', playerinformation)
app.route('/playerprediction', playerprediction)
app.route('/playerranking', playerranking)
app.route('/showsimilarplayers', showsimilarplayers)
app.route('/teamranking', teamranking)
app.route('/timeformatch', timeformatch)

serve({
    fetch:app.fetch,
    port:3000
})
