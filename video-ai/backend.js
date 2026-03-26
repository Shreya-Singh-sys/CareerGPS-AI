app.post("/api/video-upload", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const audioPath = videoPath + ".mp3";

    // 🎵 Extract audio
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .output(audioPath)
        .noVideo()
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // 🧠 Transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "gpt-4o-transcribe",
    });

    const text = transcription.text;

    // 🤖 Extract structured data
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "Extract name, skills, education, experience, role from text. Return JSON.",
        },
        { role: "user", content: text },
      ],
    });

    const extracted = JSON.parse(
      completion.choices[0].message.content
    );

    res.json({
      transcript: text,
      extracted,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});