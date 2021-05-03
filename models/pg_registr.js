const { Client } = require('pg');


// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення
  
// }
  
  
class pg_Reg{
    constructor(val1){
        this.val1 = val1;
    };
    consend(){
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: '000000',
            port: 5432,
        });
        client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack));
        console.log("INSERT INTO users VALUES("+this.val1+")");
        const query = "INSERT INTO users VALUES("+this.val1+")";

        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('table was updated with new data');
            client.end();
        });
    };
}

module.exports = pg_Reg;