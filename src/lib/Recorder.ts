export default class AudioRecorder {
    private recorderApi!: MediaRecorder;
    private stream!: MediaStream;
    private chunks: Blob[] = [];

    constructor(stream: MediaStream) {
        this.stream = stream;

        this.recorderApi = new MediaRecorder(this.stream, {
            mimeType: "audio/webm",
        });

        this.recorderApi.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                this.chunks.push(event.data);
            }
        };

        this.recorderApi.onstop = () => {
            console.log("Recording stopped, processing data...");
            const blob = new Blob(this.chunks, { type: "audio/webm" });
            const url = URL.createObjectURL(blob);
            console.log("Recording URL:", url);
            const a = document.createElement("a");
            a.href = url;
            a.download = "recording.webm";
            a.click();
        };
    }

    start(): void {
        this.recorderApi.start();
        console.log("Recording started");
    }

    stop(): void {
        this.recorderApi.stop();
        console.log("Recording stopped");
    }
}
