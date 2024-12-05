const server = require('./app');
const port = 8080 || process.env.PORT;
server.listen(port, () => {
    console.log(`Server is running at ${port}`)
})