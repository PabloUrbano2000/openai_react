import { translateResponse } from "../../interfaces";

export const translateTextUseCase = async (prompt: string, lang: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) {
      return {
        ok: false,
        message: "No se pudo realizar la traducción",
      };
    } else {
      const data: translateResponse = await resp.json();

      return {
        ok: true,
        message: data.message || "",
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo traducir",
    };
  }
};
