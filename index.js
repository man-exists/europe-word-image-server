const { createCanvas, loadImage } = require('canvas')
const translate = require('@vitalets/google-translate-api')
const cors = require('cors')

const express = require('express')
const app = express()

const countries = require('./countries.json')

app.use(express.json())
app.use(cors())

app.get('/:word', (req, res) => {
    
    console.log(`[-] Processing '${req.params.word}'`)

    const canvas = createCanvas(2560, 1958)
    const context = canvas.getContext('2d')

    loadImage('./europe.png').then(async (image) => {
        await context.drawImage(image, 0, 0, canvas.width, canvas.height)

        for (country of countries) {
            context.font = `${country.fontSize} Source Code Pro Bold, sans-serif`
            context.fillStyle = '#000000'

            const res = await translate(req.params.word, { to: country.language })
            await context.fillText(res.text, country.x, country.y)

        }

        // await fs.writeFileSync('./result.png', canvas.toBuffer())

        const img = Buffer.from(canvas.toBuffer(), 'base64')

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        })

        res.end(img)

        console.log(`[+] Finished Processing '${req.params.word}'`)

    })

})

app.listen(8000, () => console.log('[+] Server Online.'))