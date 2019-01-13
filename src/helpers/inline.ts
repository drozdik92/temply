// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
const fuzzysearch = require('fuzzysearch')

export function setupInline(bot: Telegraf<ContextMessageUpdate>) {
  bot.on('inline_query', async ({ inlineQuery, answerInlineQuery, dbuser }) => {
    const offset = parseInt(inlineQuery.offset) || 0
    const templates = dbuser.templates
      .filter(t =>
        inlineQuery.query ? fuzzysearch(inlineQuery.query, t.text) : true
      )
      .splice(offset, 30)
    const results = templates.map(template => ({
      type: 'article',
      id: template.name,
      title: template.name,
      description: template.text,
      input_message_content: {
        message_text: template.text,
      },
    }))
    return answerInlineQuery(results, { next_offset: `${offset + 30}` })
  })
}