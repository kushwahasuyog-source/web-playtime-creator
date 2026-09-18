import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PROJECT_ID = "3b96688c-2ace-4b9b-af85-a07e05045582";

function publicBaseUrl(): string {
  const request = getRequest();
  const host = request ? new URL(request.url).host : "";
  if (host && !host.includes("localhost") && !host.includes("id-preview--")) {
    return `https://${host}`;
  }
  return `https://project--${PROJECT_ID}-dev.lovable.app`;
}

/** Generate a bot specification from a plain-language description. */
export const generateBot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().min(10).max(2000), templateSlug: z.string().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { generateBotSpec } = await import("@/lib/aiBot.server");
    const spec = await generateBotSpec(data.prompt);

    const { data: bot, error } = await context.supabase
      .from("bots")
      .insert({
        owner_id: context.userId,
        name: spec.name,
        prompt: data.prompt,
        spec,
        status: "draft",
        template_slug: data.templateSlug ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const rows = spec.commands.map((c, i) => ({
      bot_id: bot.id,
      owner_id: context.userId,
      command: c.command.startsWith("/") ? c.command : `/${c.command}`,
      description: c.description,
      reply: c.reply,
      use_ai: c.useAi,
      position: i,
    }));
    if (rows.length) {
      const { error: cmdError } = await context.supabase.from("bot_commands").insert(rows);
      if (cmdError) throw new Error(cmdError.message);
    }

    return { botId: bot.id as string, spec };
  });

/** Verify a BotFather token, store it encrypted and remember the bot username. */
export const connectToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ botId: z.string().uuid(), token: z.string().min(20) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { getMe } = await import("@/lib/telegram.server");
    const { encryptToken } = await import("@/lib/botCrypto.server");

    const info = await getMe(data.token.trim());
    const { error } = await context.supabase
      .from("bots")
      .update({
        token_cipher: encryptToken(data.token.trim()),
        token_hint: `…${data.token.trim().slice(-4)}`,
        telegram_username: info.username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.botId)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);

    return { username: info.username };
  });

/** Turn a bot on (register the Telegram webhook) or off. */
export const setBotLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ botId: z.string().uuid(), live: z.boolean() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { decryptToken, webhookSecretForBot } = await import("@/lib/botCrypto.server");
    const telegram = await import("@/lib/telegram.server");

    const { data: bot, error } = await context.supabase
      .from("bots")
      .select("id, token_cipher")
      .eq("id", data.botId)
      .eq("owner_id", context.userId)
      .single();
    if (error || !bot) throw new Error("Bot not found");
    if (!bot.token_cipher) throw new Error("Connect your BotFather token first.");

    const token = decryptToken(bot.token_cipher);

    if (data.live) {
      await telegram.setWebhook(
        token,
        `${publicBaseUrl()}/api/public/telegram/webhook/${bot.id}`,
        webhookSecretForBot(bot.id),
      );
      const { data: cmds } = await context.supabase
        .from("bot_commands")
        .select("command, description")
        .eq("bot_id", bot.id)
        .order("position");
      const list = (cmds ?? [])
        .map((c) => ({
          command: c.command.replace(/^\//, ""),
          description: c.description || "…",
        }))
        .filter((c) => /^[a-z0-9_]{1,32}$/.test(c.command));
      if (list.length) await telegram.setMyCommands(token, list);
    } else {
      await telegram.deleteWebhook(token);
    }

    await context.supabase
      .from("bots")
      .update({ status: data.live ? "live" : "paused", updated_at: new Date().toISOString() })
      .eq("id", bot.id)
      .eq("owner_id", context.userId);

    return { status: data.live ? "live" : "paused" };
  });
