const fs = require('fs');
const { resolve } = require('path');
const path = require('path');

class Registration {
    constructor(name,username,login,password,email){
        this.name = name;
        this.username = username;
        this.login = login;
        this.password = password;
        this.email = email;
    }

    toJson(){
        return {
            name: this.name,
            username: this.username,
            login: this.login,
            password: this.password,
            email: this.email
        }
    }

    async save(){
        const reg = await Registration.getAll();
        reg.push(this.toJson());
        return new Promise((resolve,reject) =>{
            fs.writeFile(
                path.join(__dirname, '..', '/data', 'users.json'),
                JSON.stringify(reg),
                (err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve();
                    }
                }
            )
        })
    }

    

    static getAll(){
        return new Promise((resolve,reject)=>{
            fs.readFile(
                path.join(__dirname,'..', 'data','users.json'),
                'utf-8',
                (err,content) =>{
                    if (err){
                        reject(err);
                    }else{
                        resolve(JSON.parse(content));
                    }
                }
            )
        })
    }
}

module.exports = Registration;