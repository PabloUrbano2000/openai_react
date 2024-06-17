import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { translateTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);

    //TODO: use Case
    const { ok, message } = await translateTextUseCase(text, selectedOption);

    setIsLoading(false);
    if (!ok) {
      return alert(message);
    }

    setMessages((prev) => [...prev, { text: message, isGpt: true }]);

    //Todo: Añadir el mensaje de isGPT en TRUE
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="¿Qué quieres que traduzca hoy?"></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}
          {isLoading ? (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          ) : null}
        </div>
      </div>
      <TextMessageBoxSelect
        onSendMessage={(message, selectedOption) =>
          handlePost(message, selectedOption)
        }
        placeholder="Escribe aquí"
        options={languages}
      />
    </div>
  );
};
