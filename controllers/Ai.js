import axios from "axios";

export const summarizeNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "No content provided" });
    }

    // 🔹 Hugging Face API
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        inputs: content,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    console.log("HF RAW:", response.data);

    // ✅ Extract summary
    const summary = response.data[0]?.summary_text;

    if (!summary) {
      return res.status(500).json({ message: "No summary returned" });
    }

    res.json({ summary });

  } catch (error) {
    console.error("🔥 HF ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI failed",
      error: error.response?.data || error.message,
    });
  }
};