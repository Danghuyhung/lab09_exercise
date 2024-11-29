const hdb=require('express-handlebars')
const express=require('express')
const app=express()
app.engine('handlebars',hdb.engine({
    defaultLayout:'main',
}))
app.set('view engine','handlebars')
const port=3000
app.use(express.json())

const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
    ]
const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
    ]
app.get('/api/tours', (req, res) => res.json(tours))

app.post('/api/tour', (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const newTour = {
        id: tours.length, 
        name,
        price
    };
    
    tours.push(newTour);
    res.status(201).json(newTour);
});

app.get('/api/tour/search', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).json({ error: 'Name query parameter is required' });
    }
    const foundTours = tours.filter(tour => tour.name.toLowerCase().includes(name.toLowerCase()));
    if (foundTours.length === 0) {
        return res.status(404).json({ error: 'No tours found' });
    }
    res.json(foundTours);
});

app.put('/api/tour/:id', (req, res) => {
    const p = tours.find(p => p.id === parseInt(req.params.id))
    if(!p) return res.status(404).json({ error: 'No such tour exists' })
    if(req.body.name) p.name = req.body.name
    if(req.body.price) p.price = req.body.price
    res.json({ success: true })
})  
app.delete('/api/tour/:id', (req, res) => {
    const idx = tours.findIndex(tour => tour.id === parseInt(req.params.id))
    if(idx < 0) return res.json({ error: 'No such tour exists.' })
    tours.splice(idx, 1)
    res.json({ success: true })
    })    
app.get('/',(req,res)=>res.render('home'))
app.get('/about',(req,res)=>{
    const dong=10, cot=15
    let html='<table border=1>'
    for(let i=1;i<=dong;i++){
        html+='<tr>'
        for(let j=1;j<=cot;j++){
            html+='<td>'+i*j+'</td>'
        }
        html+='</tr>'
    }
    html+='</table>'
    res.render('about',{html})
})

app.use((req,res)=>{
    res.status(404)
    res.render('404')
})

app.use((err,req,res,next)=>{
    console.error(err.message)
    res.status(500)
    res.render('500')
})
app.listen(port,()=>{
    console.log(`Express started on http://localhost:${port}`)
})