const WorkerModel = require("../../models/worker.model");

async function displayWorker(req , res){

    try {
        
        const workers = await WorkerModel.find();

        res.status(201).json({
            message : "Worker's Data",
            workers : workers
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            messagfe : "Internal Server Error"
        })
    }
}

module.exports = {displayWorker}