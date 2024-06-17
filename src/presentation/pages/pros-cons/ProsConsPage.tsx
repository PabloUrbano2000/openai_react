import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";

interface Message {
  content: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { content: text, isGpt: false }]);

    const data = await prosConsDiscusserUseCase(text);
    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        { content: "No se pudo realizar la corrección", isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          content: data.content,
          isGpt: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Puedes escribir lo que sea que quieras que compare y te daré mis puntos de vista"></GptMessage>{" "}
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.content} />
            ) : (
              <MyMessage key={index} text={message.content} />
            )
          )}
          {isLoading ? (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          ) : null}
        </div>
      </div>
      <TextMessageBox
        onSendMessage={(message) => handlePost(message)}
        placeholder="Escribe aquí"
        disableCorrections={false}
      />
    </div>
  );
};
