import { Worker, Job } from 'bullmq';
import ffmpeg from 'fluent-ffmpeg';
import * as dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

console.log('🚀 Video Processor Worker starting...');

const worker = new Worker(
    'video-processing',
    async (job: Job) => {
        const { inputPath, outputPath, videoId } = job.data;

        console.log(`📦 Processing video job ${job.id} for video ${videoId}...`);

        return new Promise<{ videoId: string; status: string; outputPath: string }>((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    '-c:v libx264',
                    '-crf 23',
                    '-profile:v baseline',
                    '-level 3.0',
                    '-pix_fmt yuv420p',
                    '-c:a aac',
                    '-ac 2',
                    '-b:a 128k',
                    '-movflags faststart'
                ])
                .on('start', (commandLine: string) => {
                    console.log('Spawned FFmpeg with command: ' + commandLine);
                })
                .on('progress', (progress: { percent?: number }) => {
                    if (progress.percent !== undefined) {
                        job.updateProgress(progress.percent);
                    }
                })
                .on('error', (err: Error) => {
                    console.error('An error occurred: ' + err.message);
                    reject(err);
                })
                .on('end', () => {
                    console.log('Processing finished!');
                    resolve({ videoId, status: 'completed', outputPath });
                })
                .save(outputPath);
        });
    },
    { connection: { url: redisUrl } }
);

worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed with ${err.message}`);
});
