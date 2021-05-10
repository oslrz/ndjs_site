const { Client } = require('pg');
let data = '';

class pg_Log{
    constructor(x){
        this.val = x;
    }
    send(){
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: '000000',
            port: 5432
        });
        client.connect();
        return new Promise((resolve, reject) => {
            client.query("SELECT name, username from users WHERE "+this.val+";", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('ressss',res.rows)
                resolve(res.rows)
            })
        }).then(()=>{
            client.end();
        })
    }
}

module.exports = pg_Log;