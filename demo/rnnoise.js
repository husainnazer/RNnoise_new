// (async function () {

navigator.mediaDevices.getUserMedia({ audio: true }).then(async (hello) => {
    console.log(hello)
    const context = new AudioContext({ sampleRate: 48000 });
    try {
        const destination = new MediaStreamAudioDestinationNode(context, {
            channelCountMode: "explicit",
            channelCount: 1,
            channelInterpretation: "speakers",
        });

//         const destination = context.destination

        const [stream] = await Promise.all([
            navigator.mediaDevices.getUserMedia({
                audio: {
                    // deviceId: { exact: input.value },
                    // channelCount: { ideal: 1 },
                    noiseSuppression: false,
                    autoGainControl: false,
                },
                // audio: true
            }),
            RNNoiseNode.register(context),
        ]);

        // const stream = await navigator.mediaDevices.getUserMedia({
        //     audio: true
        // })

        

        const source = context.createMediaStreamSource(stream);
        const rnnoise = new RNNoiseNode(context);
        rnnoise.connect(destination);
        source.connect(rnnoise);

        const audio = new Audio();
        audio.srcObject = destination.stream;
        audio.play();
        
    } catch (e) {
        context.close();
        console.error(e);
    }
}).catch(err => {
    console.error(err)
})

// })();
