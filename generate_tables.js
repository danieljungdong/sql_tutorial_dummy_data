/* 
SQL Tutorial for Business Growth
Copyright © 2021 daniel@lazyenterprise.com
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const fs = require("fs");
const { spawn } = require('child_process');


//helper function for random date generation
let datehelper = (yearlookback= 2)=>{
    let dte = new Date(Date.now())
    dte.setFullYear(dte.getFullYear() - Math.floor(Math.random() * yearlookback))
    dte.setMonth(dte.getMonth() - Math.floor(Math.random() * 12))
    dte.setDate(dte.getDay() - Math.floor(Math.random() * 31))
    dte.setHours(dte.getHours() - Math.floor(Math.random() * 24))
    dte.setMinutes(dte.getMinutes() - Math.floor(Math.random() * 60))
    return dte
}


//keys used to generate schema + table
let keys = {
    loan: {
        //establish length
        tableLength:{
            webpage_visits: 100000, 
            get visit_event() {return this.webpage_visits * 10}, 
            get applications() {return Math.round(this.webpage_visits / 89)}, 
            get underwriting_decisions() {return Math.round(this.applications/2.5)}, 
            get installments() {return Math.round(this.underwriting_decisions/4)*3}, 
            get users() {return Math.round(this.applications/1.2)},
        }
        //establish waterfall of events
        , funnelWaterFall:{
            earlytolatest: ['webpage_visits', 'visit_event', 'applications', 'underwriting_decisions', 'installments'],
            indexId: {
                webpage_visits: 'visit_id'
                , visit_event: 'event_id'
                , applications: 'application_id'
                , underwriting_decisions: 'underwriting_decision_id'
                , installments: 'installment_id'
            }
        } 
        // define the columns in each tables   
        , columns :{
            webpage_visits(id, tableWrapper) {
                return {visit_id: id,
                    webpage_url: ["my.com/homepage", "my.com/secondpage", "my.com/thirdpage", "my.com/buy"][Math.floor(Math.random() * 4 % 3)],
                    source: ['google.com', 'facebook.com', 'randomad.com', 'hello.com'][Math.floor(Math.random() * 4 % 3)], 
                    user_id: Math.floor(Math.random()* tableWrapper.tableLength.users), 
                    createdTimeStamp: datehelper(), 
                }
            }, 
            visit_event(id, tableWrapper) {
                return {
                        event_id: id ,
                        visit_id: Math.floor(Math.random()* tableWrapper.tableLength.webpage_visits),
                        event_type: ['click', 'play', 'hover'][Math.round(Math.random()*3)%2],
                        experiment_group: ['test-a', 'test-b', 'control'][Math.round(Math.random()*3)%2],
                        user_id: Math.floor(Math.random()* tableWrapper.tableLength.users),
                        createdTimeStamp: datehelper(), 

                }
            },
            applications(id, tableWrapper) {
                return {user_id: Math.floor(Math.random()* tableWrapper.tableLength.users),
                    application_id: id,
                    income: Math.floor(Math.random()* 100000), 
                    region: ['Central', 'South', 'Southwest', 'East', 'Northwest'][Math.floor(Math.random() * 5 % 4)], 
                    amount_requested: Math.floor(Math.random()* 5000), 
                    createdTimeStamp: datehelper(), 
                }
            }, 
            underwriting_decisions(id, tableWrapper) {
                return {user_id: Math.floor(Math.random()* tableWrapper.tableLength.users),
                    application_id: Math.floor(Math.random()* tableWrapper.tableLength.applications),
                    underwriting_decision_id: id,
                    decision: ['approved', 'declined', 'undecided'][Math.floor(Math.random()* 3 % 2)], 
                    amount: Math.random() * Math.floor(Math.random()* 5000), 
                    createdTimeStamp: datehelper()
                }
            }, 
            installments(id, tableWrapper) {
                return {installment_id:id,
                    underwriting_decision_id: Math.floor(Math.random()* tableWrapper.tableLength.underwriting_decisions % id),
                    createdTimeStamp: datehelper(),
                    default: Math.random() < 0.5 
                }
            }, 
            users(id, tableWrapper) {
                return {user_id: id, 
                    name: ['John', 'Alex', 'Abby', 'May', 'Cassie', 'Sarah', 'Donald'] [Math.floor(Math.random() * 7 % 6)] + ' ' +['Doe', 'Goodman', 'Water', 'Smith', 'Rutherford'][Math.floor(Math.random() * 5 % 4)],
                    Age: Math.floor(Math.random()* 60) + 20,
                    income: Math.floor(Math.random()* 100000)
                }
            }, 
        }
    },
    leads: {
        tableLength:{
            webpage_visits: 100000, 
            get visit_event() {return this.webpage_visits * 10}, 
            get leads() {return Math.round(this.webpage_visits / 89)}, 
            get opportunities() {return Math.round(this.leads/2.5)}, 
            get sales() {return Math.round(this.opportunities/2)}, 
            get calls() {return Math.round(this.leads)*5}, 
            get users() {return Math.round(this.leads/1.2)},
        }
        , funnelWaterFall:{
            earlytolatest: ['webpage_visits', 'visit_event', 'leads', 'opportunities', 'sales'], 
            indexId: {
                webpage_visits: 'visit_id'
                , visit_event: 'event_id'
                , leads: 'lead_id'
                , opportunities: 'opportunity_id'
                , sales: 'sale_id'
            }
        }         
        , columns :{
            webpage_visits(id, tableWrapper) {
                return {visit_id: id,
                    webpage_url: ["my.com/homepage", "my.com/secondpage", "my.com/thirdpage", "my.com/buy"][Math.floor(Math.random() * 4 % 3)],
                    source: ['google.com', 'facebook.com', 'randomad.com', 'hello.com'][Math.floor(Math.random() * 4 % 3)], 
                    user_id: Math.floor(Math.random()* tableWrapper.tableLength.users), 
                    createdTimeStamp: datehelper()
                }
            }, 
            visit_event(id, tableWrapper) {
                return {
                    event_id: Math.floor(Math.random()* tableWrapper.tableLength.visit_event),
                    visit_id: id,
                    event_type: ['click', 'play', 'hover'][Math.round(Math.random()*3)%2],
                    experiment_group: ['test-a', 'test-b', 'control'][Math.round(Math.random()*3)%2],
                    user_id: Math.floor(Math.random()* tableWrapper.tableLength.users),
                    createdTimeStamp: datehelper(), 
                }
            },
            leads(id, tableWrapper) {
                return {user_id: Math.floor(Math.random()* tableWrapper.tableLength.users),
                    lead_id: id,
                    company_name: ['Big', 'Small', 'Medium'][Math.floor(Math.random() * 3 % 2)] + ' ' + ['Technology', 'Software', 'Construction', 'Trucks', 'Restaurant'][Math.floor(Math.random() * 5 % 4)] + ' ' + ['LLC', 'Group', 'Ltd'][Math.floor(Math.random() * 3 % 2)],
                    company_size: ['1-2', '2-5', '5-50', '50-100', '100+'][Math.floor(Math.random() * 5 % 4)], 
                    requested_product: ['Product A', 'Product B', 'Product C', 'Product A + B', 'Product A + C'][Math.floor(Math.random() * 5 % 4)], 
                    createdTimeStamp: datehelper(), 
                }
            }, 
            opportunities(id, tableWrapper) {
                return {
                    opportunity_id: id,
                    lead_id: Math.floor(Math.random()* tableWrapper.tableLength.leads),
                    oppotrunity_status: ['qualified', 'lost', 'won'][Math.floor(Math.random()* 3 % 2)], 
                    amount: Math.floor(Math.random()* 10000), 
                    createdTimeStamp: datehelper()
                }
            }, 
            sales(id, tableWrapper) {
                return { sale_id: id,
                    opportunity_id: Math.floor(Math.random()* tableWrapper.tableLength.opportunities),
                    createdTimeStamp: datehelper()
                }
            }, 
            calls(id, tableWrapper) {
                return {
                    call_id: id, 
                    user_id:  Math.floor(Math.random()* tableWrapper.tableLength.users),
                    createdTimeStamp: datehelper()
                }
            }, 
            users(id, tableWrapper) {
                return {user_id: id, 
                    name: ['John', 'Alex', 'Abby', 'May', 'Cassie', 'Sarah', 'Donald'] [Math.floor(Math.random() * 7 % 6)] + ' ' +['Doe', 'Goodman', 'Water', 'Smith', 'Rutherford'][Math.floor(Math.random() * 5 % 4)],
                }
            }, 
        }
    }
}


let begin_program = async()=>{
    console.log("\x1b[32mGenerating dummy data sets... \x1b[37m")
    let generate_tables = Object.keys(keys).map((key)=>{
        return new Promise ((res, rej)=>{
            try{
                for (const table of Object.keys(keys[key].tableLength)){
                    //create write stream
                    const filename = `data/${key}_${table}.csv`
                    let writeStream = fs.createWriteStream(filename);
            
                    //header
                    const headerArray = Object.keys(keys[key].columns[table](0, keys[key]))
                    const header = headerArray.join(',')
                    //data
                    const rows = [...Array(keys[key].tableLength[table])].map((e,i)=>{
                        const row = Object.values(keys[key].columns[table](i, keys[key]))
                        return row.join(',');
                    })
                    rows.unshift(header)
                    const data = rows.join("\n")
                    writeStream.write(data, ()=>{})
                    writeStream.on("drain", ()=>{
                        writeStream.end()
                    })
                    console.log(`generated dummy data for ${key}_${table} at data/${key}_${table}.csv`)
                }
                res()
            }
            catch(error){
                rej("Something went wrong", error)
            }

        })
    })

    await Promise.all(generate_tables)

    const connectionURI = 'postgresql://postgres:1234@localhost:5432'
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
const installationQuestion = `\n\x1b[40m\x1b[0m\x1b[32mWould you like push the generated data to your installed PostgresSQL instance? \x1b[37m (\x1b[32mY\x1b[37m/\x1b[33mN\x1b[37m) \n Press Y to proceed, N to abort. The randomized CSV data you now have in ./data will be piped to \x1b[4m${connectionURI}\x1b[0m if you proceed. \n To proceed, this program may install \x1b[35mpandas and sqlalchemy (python libraries) \x1b[37m if you don't already have them. 
To change the SQL data piping destination, please manually change the value of connectionURI in this script.
(Y/N)`

    readline.question(installationQuestion, (answer) => {
        if(answer.toLowerCase() === 'y'){
            console.log(`\x1b[32m[2-3minutes] Executing transfer of dummy data from ./data to your local SQL location ${connectionURI}\x1b[37m`)
            const pythonPipeline = spawn('python', ['data_pipeline.py', connectionURI])
            // pythonPipeline.stdout.on('data', (pythonCLI)=>{
            //     //Here is where the output goes
            //     console.log(pythonCLI)
            // });
            pythonPipeline.on("close", (code)=>{
                console.log(`\x1b[32mExecuted python script with return code ${code} (0 means successful)\x1b[37m`)
            })
        }
        else{
            console.log("\x1b[31m Please manually import the dummy data to your SQL database location or restart this program and select y\x1b[37m")
        }
        readline.close();
    });
}

begin_program()