import os
from langchain_openai import OpenAI


class LLMService:
    def __init__(self):
        self.llm = OpenAI(
            temperature=0.5,
            top_p=0.7,
            api_key=os.getenv("HF_TOKEN"),  # type: ignore
            base_url="https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1",
        )

    # prompt foi alterado para realizar o resumo da melhor forma e na requisitada
    def summarize_text(self, text: str, lang: str) -> str:
        prompt = f"Please summarize the following text in {lang}. The summary should capture the main points and key ideas of the original text while being concise and easy to understand. Avoid unnecessary details, and ensure the summary is clear and coherent. The summary should be written in an appropriate style for the {lang} audience, without losing any critical information. Here is the text to summarize: {text}"


        response = self.llm.invoke(prompt)
        return response
