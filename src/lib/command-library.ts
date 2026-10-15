export const commandLibrary = [
  { command: "/start", description: "Welcome and introduction", reply: "Welcome! Send /help to see what I can do." },
  { command: "/help", description: "Show available commands", reply: "Tell me what you need help with and I will guide you." },
  { command: "/about", description: "About this bot", reply: "I am your Telegram assistant, built with BotForge." },
  { command: "/menu", description: "Main menu", reply: "Welcome to the main menu. Send /help for assistance." },
  { command: "/contact", description: "Contact information", reply: "Ask the bot owner for their preferred contact details." },
  { command: "/faq", description: "Frequently asked questions", reply: "Send your question and I will do my best to answer." },
  { command: "/rules", description: "Community rules", reply: "Be respectful, stay on topic, and avoid spam or sharing private information." },
  { command: "/feedback", description: "Share feedback", reply: "Thank you for your feedback. What would you like to improve?" },
  { command: "/ping", description: "Check that the bot is responding", reply: "Pong! I am here." },
  { command: "/privacy", description: "Privacy information", reply: "Avoid sending passwords, bot tokens, or other sensitive information in this chat. Ask the owner about their data policy." },
  { command: "/ask", description: "Ask the AI assistant", reply: "What would you like to know?", useAi: true },
  { command: "/summarize", description: "Summarize text with AI", reply: "Send the text you want summarized.", useAi: true },
] as const;