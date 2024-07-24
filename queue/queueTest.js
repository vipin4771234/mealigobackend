import { queueManager } from './queueManager.js';
import { processJob } from './processJob.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Use this snippet at the top of your file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function testQueueLogic() {
    const queueName = 'testQueue';
    const workerScriptPath = path.resolve(__dirname, '../workers/mockWorker.js');
    const testQueue = queueManager.createQueue(queueName, workerScriptPath);
  
    // Mock job and task
    const job = 'testJob';
    const task = 'testTask';
  
    console.log(`Adding job ${job} with task ${task} to queue ${queueName}`)
  
    // Listen for job completed event
    const jobCompletedPromise = new Promise((resolve, reject) => {
      testQueue.on('completed', (job, result) => {
        console.log(`Job ${job.id} completed with result ${result}`);
        resolve();
      });
  
      testQueue.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed with error ${err}`);
        reject(err);
      });
    });
  
    // Process job
    await processJob(job, queueName, task);
    
    console.log(`Job ${job} with task ${task} added to queue ${queueName}`)
  
    // Wait for the job to be completed or failed
    await jobCompletedPromise;
  }
  

// Call the testing function
testQueueLogic().catch(console.error);
