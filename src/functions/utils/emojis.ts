import { formatEmoji } from "discord.js";
import fs from "node:fs/promises";

// Importa os emojis do arquivo JSON dependendo do ambiente
type EmojiList = typeof import("#emojis");

// Lê o arquivo de emojis com base no ambiente (dev ou produção)
const filepath = process.env.ENV === "dev" ? "emojis.dev.json" : "emojis.json";
const file = await fs.readFile(filepath, "utf-8");
const emojis: EmojiList = JSON.parse(file);

// Define os tipos necessários para os emojis
type IconKey = keyof EmojiList["animated"] | keyof EmojiList["static"];
type IconInfo = { id: string, animated?: boolean, toString(): string };

// O objeto icon agora mapeia os emojis diretamente, com tipos específicos
const icon: Record<IconKey, IconInfo> = {}; 

// Função genérica para transformar e adicionar os emojis ao objeto `icon`
const transformEmojis = (emojis: Record<string, string>, animated: boolean = false): void => {
    // Atribui cada emoji diretamente ao objeto `icon`, simplificando a estrutura
    Object.entries(emojis).forEach(([name, id]) => {
        icon[name as IconKey] = {
            id,
            animated,
            toString: () => formatEmoji(id, animated),
        };
    });
};

// Aplica a transformação para os emojis estáticos e animados
transformEmojis(emojis.static);
transformEmojis(emojis.animated, true);

export { icon };
