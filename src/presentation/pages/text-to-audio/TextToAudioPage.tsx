import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxSelect,
  TypingLoader,
} from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";
import { GptMessageAudio } from "../../components/bubbles/GptMessageAudio";

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: "text";
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: "audio";
}

type Message = TextMessage | AudioMessage;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

const disclaimer = `## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`;

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false, type: "text" }]);

    //TODO: use Case
    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );

    setIsLoading(false);

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        isGpt: true,
        type: "audio",
        audio: audioUrl!,
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text={disclaimer} />
          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audio={message.audio}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
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
        onSendMessage={(message, selectedVoice) =>
          handlePost(message, selectedVoice)
        }
        placeholder="Escribe aquí"
        disableCorrections={false}
        options={voices}
      />
    </div>
  );
};
